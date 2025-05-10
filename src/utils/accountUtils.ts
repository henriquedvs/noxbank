/**
 * Cleans and formats an account number by removing spaces, dashes, and other non-alphanumeric characters
 * @param accountNumber The account number to clean
 * @returns Cleaned account number
 */
export const cleanAccountNumber = (accountNumber: string): string => {
  // Remove spaces, dashes and keep only alphanumeric characters
  return accountNumber.replace(/[\s-]/g, "").toUpperCase();
};

/**
 * Validates if an account number follows the NOX format
 * @param accountNumber The account number to validate
 * @returns Boolean indicating if the account number is valid
 */
export const isValidAccountFormat = (accountNumber: string): boolean => {
  // Basic validation for NOX-XXXXX-XXXXX format
  const cleanedAccount = cleanAccountNumber(accountNumber);
  return cleanedAccount.length >= 5 && cleanedAccount.includes("NOX");
};

/**
 * Formats an account number for display in UI
 * @param accountNumber The account number to format
 * @returns Formatted account number for display
 */
export const formatAccountNumberForDisplay = (accountNumber: string): string => {
  const cleaned = cleanAccountNumber(accountNumber);
  if (cleaned.startsWith("NOX") && cleaned.length >= 13) {
    // Format as NOX-XXXXX-XXXXX
    return `NOX-${cleaned.substring(3, 8)}-${cleaned.substring(8, 13)}`;
  }
  return accountNumber;
};

/**
 * Prepares an account number for search query
 * @param accountNumber The account number to prepare for search
 * @returns Account number prepared for search
 */
export const prepareAccountNumberForSearch = (accountNumber: string): string => {
  const cleaned = cleanAccountNumber(accountNumber);
  
  // If it starts with NOX, just return the cleaned version
  if (cleaned.startsWith("NOX")) {
    return `%${cleaned}%`;
  }
  
  // If it doesn't include NOX prefix, add it
  return `%NOX${cleaned}%`;
};

/**
 * Normalizes search query for more effective database matching
 * @param searchTerm The term to normalize
 * @returns Normalized search term for database query
 */
export const normalizeSearchTerm = (searchTerm: string): string => {
  // Remove common separators and format consistently
  return `%${searchTerm.replace(/[\s-_]/g, "")}%`.toUpperCase();
};

/**
 * Improved account number search function for better matching
 * This can be used for multiple search strategies
 * @param searchTerm The term to search for
 * @returns Search term ready for ilike query
 */
export const prepareAccountSearch = (searchTerm: string): string => {
  const cleaned = searchTerm.replace(/[\s-_]/g, "").toUpperCase();
  
  // If NOX prefix exists, preserve it in search
  if (cleaned.includes("NOX")) {
    return `%${cleaned}%`;
  }
  
  // Try both with and without NOX prefix
  return cleaned.length > 3 ? `%${cleaned}%` : `%NOX${cleaned}%`;
};

/**
 * Prepares a username search query
 * @param username The username to prepare for search (with or without @ symbol)
 * @returns Username prepared for search
 */
export const prepareUsernameSearch = (username: string): string => {
  // Remove @ symbol if present and format for ilike search
  return `%${username.replace('@', '').toLowerCase()}%`;
};

/**
 * Fetches all registered users from the database
 * @param supabaseClient Supabase client instance
 * @param currentUserId Current user ID to exclude from results
 * @returns Promise with user data
 */
export const fetchAllUsers = async (supabaseClient: any, currentUserId: string) => {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('id, username, full_name, account_number, avatar_url')
      .neq('id', currentUserId)
      .order('full_name', { ascending: true })
      .limit(50);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

/**
 * Search for users based on account number, username or name
 * @param supabaseClient Supabase client instance
 * @param searchTerm Search term
 * @param currentUserId Current user ID to exclude from results
 * @returns Promise with search results
 */
export const searchUsers = async (supabaseClient: any, searchTerm: string, currentUserId: string) => {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }
    
    let cleanedTerm = searchTerm.toLowerCase().trim();
    let query = supabaseClient
      .from('profiles')
      .select('id, username, full_name, account_number, avatar_url')
      .neq('id', currentUserId);
    
    // If search contains @ symbol, prioritize username search
    if (searchTerm.includes('@')) {
      cleanedTerm = cleanedTerm.replace('@', '');
      query = query.ilike('username', `%${cleanedTerm}%`);
    } else {
      // Otherwise search by name or account number
      query = query.or(`username.ilike.%${cleanedTerm}%,full_name.ilike.%${cleanedTerm}%,account_number.ilike.%${cleanedTerm}%`);
    }
    
    const { data, error } = await query.limit(20);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};
