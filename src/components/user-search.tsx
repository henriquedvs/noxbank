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
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  
  // Fetch all users initially
  useEffect(() => {
    const loadUsers = async () => {
      if (!user) return;
      
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, account_number, avatar_url')
          .neq('id', user.id)
          .order('full_name', { ascending: true });
          
        if (error) throw error;
        
        setAllUsers(profiles || []);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários.",
          variant: "destructive",
        });
      }
    };
    
    loadUsers();
  }, [user, toast]);
  
  // Handle search with @ symbol
  useEffect(() => {
    const handleSearch = async () => {
      if (!user || searchTerm.trim() === '') {
        setFilteredUsers([]);
        return;
      }
      
      setIsSearching(true);
      try {
        // If search contains @ symbol, search by username
        if (searchTerm.includes('@')) {
          const usernameSearch = searchTerm.replace('@', '').toLowerCase();
          const results = allUsers.filter(u => 
            u.username && u.username.toLowerCase().includes(usernameSearch)
          );
          setFilteredUsers(results);
        } else {
          // Otherwise search by name or account number
          const results = allUsers.filter(u => 
            (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (u.account_number && u.account_number.toLowerCase().includes(searchTerm.toLowerCase()))
          );
          setFilteredUsers(results);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounce = setTimeout(() => {
      if (searchTerm.length >= 1) {
        handleSearch();
      } else {
        setFilteredUsers([]);
      }
    }, 300);
    
    return () => clearTimeout(debounce);
  }, [searchTerm, user, allUsers]);
  
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
  const usersToShow = searchTerm.length >= 1 ? filteredUsers : allUsers;
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-nox-textSecondary" />
        <Input
          className="pl-10 bg-nox-card text-white border-zinc-700"
          placeholder="Buscar por @username ou nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isSearching && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-nox-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {searchTerm.length >= 1 && filteredUsers.length === 0 && !isSearching && (
        <div className="text-center py-4 text-nox-textSecondary">
          Nenhum usuário encontrado com esse termo.
        </div>
      )}
      
      {usersToShow.length > 0 && (
        <>
          <h3 className="text-lg font-medium text-white">
            {searchTerm.length >= 1 ? "Resultados da busca" : "Usuários disponíveis"}
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
                    <p className="text-nox-textSecondary text-sm">
                      @{user.username}
                    </p>
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
