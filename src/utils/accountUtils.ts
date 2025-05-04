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
