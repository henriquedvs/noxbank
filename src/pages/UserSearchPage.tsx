
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

  // Define loadUsers function before using it in useEffect
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
      setFilteredUsers(profiles || []); // Show all users by default
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
  }, [user]);
  
  // Handle search with debounce
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(allUsers);
      return;
    }
    
    // If search contains @ symbol, search by username
    if (searchTerm.includes('@')) {
      const usernameSearch = searchTerm.replace('@', '').toLowerCase();
      const results = allUsers.filter(u => 
        u.username && u.username.toLowerCase().includes(usernameSearch)
      );
      setFilteredUsers(results);
    } else {
      // Otherwise search by name
      const results = allUsers.filter(u => 
        (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(results);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="p-5 bg-white border-b border-gray-100">
        <div className="flex items-center">
          <button 
            className="p-2 rounded-full bg-gray-100 mr-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Buscar usuário</h1>
        </div>
      </header>
      
      <div className="px-5 py-4 space-y-6">
        <div className="relative flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              className="pl-10 bg-gray-50 text-gray-800 border-gray-200 rounded-xl"
              placeholder="Buscar por @username ou nome"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              autoFocus
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-nox-primary rounded-xl"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
        
        {isSearching ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center p-4 bg-white rounded-xl border border-gray-100">
                <Skeleton className="h-12 w-12 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">Nenhum usuário encontrado</p>
                <p className="text-sm mt-1">Tente buscar com outro termo ou nome</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    className="bg-white p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border hover:border-nox-primary transition-all border border-gray-100 shadow-sm"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3">
                        {user.avatar_url ? (
                          <AvatarImage src={user.avatar_url} alt={user.full_name} />
                        ) : (
                          <AvatarFallback className="bg-gray-200 text-gray-700">
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-gray-800 font-medium">{user.full_name}</p>
                        <p className="text-gray-500 text-sm">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserSearchPage;
