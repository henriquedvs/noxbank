
import { useState, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const UserSearchPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [destination, setDestination] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("destination") || "/transfer";
  });

  // Defining loadUsers function before using it in useEffect
  const loadUsers = async () => {
    if (!user) return;
    
    setIsSearching(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .neq('id', user.id)
        .order('full_name', { ascending: true });
        
      if (error) throw error;
      
      setAllUsers(profiles || []);
      setFilteredUsers(searchTerm ? [] : profiles || []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch all users on component mount
  useEffect(() => {
    loadUsers();
  }, []);
  
  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredUsers(allUsers);
      return;
    }
    
    // If search contains @ symbol, search by username
    if (value.includes('@')) {
      const usernameSearch = value.replace('@', '').toLowerCase();
      const results = allUsers.filter(u => 
        u.username && u.username.toLowerCase().includes(usernameSearch)
      );
      setFilteredUsers(results);
    } else {
      // Otherwise search by name
      const results = allUsers.filter(u => 
        (u.full_name && u.full_name.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredUsers(results);
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "??";
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };
  
  // Handle user selection
  const handleSelectUser = (user: any) => {
    const encodedUser = encodeURIComponent(JSON.stringify(user));
    navigate(`${destination}?selectedUser=${encodedUser}`);
  };
  
  return (
    <div className="min-h-screen bg-nox-background">
      {/* Header */}
      <header className="p-5">
        <div className="flex items-center">
          <button 
            className="p-2 rounded-full bg-nox-card mr-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-nox-textSecondary" />
          </button>
          <h1 className="text-xl font-semibold text-white">Buscar usuário</h1>
        </div>
      </header>
      
      <div className="px-5 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-nox-textSecondary" />
          <Input
            className="pl-10 bg-nox-card text-white border-zinc-700"
            placeholder="Buscar por @username ou nome"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
        </div>
        
        {isSearching && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-nox-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {!isSearching && filteredUsers.length === 0 && (
          <div className="text-center py-4 text-nox-textSecondary">
            Nenhum usuário encontrado.
          </div>
        )}
        
        <div className="space-y-2 max-h-[75vh] overflow-y-auto pb-16">
          {filteredUsers.map(user => (
            <div 
              key={user.id}
              className="bg-nox-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border hover:border-nox-primary transition-all"
              onClick={() => handleSelectUser(user)}
            >
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-3">
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} alt={user.full_name} />
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
      </div>
    </div>
  );
};

export default UserSearchPage;
