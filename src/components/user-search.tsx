
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAllUsers, searchUsers } from "@/utils/accountUtils";
import { useToast } from "@/hooks/use-toast";

interface UserSearchProps {
  onSelectUser: (user: any) => void;
  showRecent?: boolean;
}

const UserSearch = ({ onSelectUser, showRecent = true }: UserSearchProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  
  // Fetch all users initially
  useEffect(() => {
    const loadUsers = async () => {
      if (!user) return;
      
      try {
        const users = await fetchAllUsers(supabase, user.id);
        setAllUsers(users);
        
        if (showRecent) {
          // Fetch recent contacts (could be from transactions table)
          const { data: transactions } = await supabase
            .from('transactions')
            .select(`
              receiver_id,
              profiles!transactions_receiver_id_fkey(id, username, full_name, account_number, avatar_url)
            `)
            .eq('sender_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
          
          // Extract unique receivers
          const uniqueReceivers = transactions
            ?.filter(t => t.receiver_id !== user.id && t.profiles)
            .reduce((acc, current) => {
              const receiver = current.profiles as any;
              if (!receiver) return acc;
              
              const exists = acc.find(item => item.id === receiver.id);
              if (!exists) {
                acc.push(receiver);
              }
              return acc;
            }, [] as any[]) || [];
          
          setRecentUsers(uniqueReceivers);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    
    loadUsers();
  }, [user, showRecent]);
  
  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (!user || searchTerm.trim() === '') {
        setFilteredUsers([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const results = await searchUsers(supabase, searchTerm, user.id);
        setFilteredUsers(results);
      } catch (error) {
        console.error("Search error:", error);
        toast({
          title: "Erro na busca",
          description: "Não foi possível completar a busca. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounce = setTimeout(() => {
      if (searchTerm.length >= 2) {
        handleSearch();
      } else {
        setFilteredUsers([]);
      }
    }, 300);
    
    return () => clearTimeout(debounce);
  }, [searchTerm, user, toast]);
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "??";
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };
  
  // Display users to show (either search results or all users)
  const usersToShow = searchTerm.length >= 2 ? filteredUsers : allUsers;
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-nox-textSecondary" />
        <Input
          className="pl-10 bg-nox-card text-white border-zinc-700"
          placeholder="Buscar por nome ou número de conta"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isSearching && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-nox-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {searchTerm.length >= 2 && filteredUsers.length === 0 && !isSearching && (
        <div className="text-center py-4 text-nox-textSecondary">
          Nenhum usuário encontrado com esse termo.
        </div>
      )}
      
      {showRecent && recentUsers.length > 0 && !searchTerm && (
        <>
          <h3 className="text-lg font-medium text-white">Recentes</h3>
          <div className="space-y-2">
            {recentUsers.map(user => (
              <div 
                key={user.id}
                className="bg-nox-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border hover:border-nox-primary transition-all"
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} />
                    ) : (
                      <AvatarFallback className="bg-nox-buttonInactive text-white">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{user.full_name}</p>
                    <p className="text-nox-textSecondary text-sm">{user.account_number}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-nox-textSecondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
      
      {usersToShow.length > 0 && (
        <>
          <h3 className="text-lg font-medium text-white">
            {searchTerm.length >= 2 ? "Resultados da busca" : "Todos os usuários"}
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {usersToShow.map(user => (
              <div 
                key={user.id}
                className="bg-nox-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border hover:border-nox-primary transition-all"
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} />
                    ) : (
                      <AvatarFallback className="bg-nox-buttonInactive text-white">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{user.full_name}</p>
                    <p className="text-nox-textSecondary text-sm">{user.account_number}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-nox-textSecondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserSearch;
