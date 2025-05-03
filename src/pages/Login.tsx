
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from '@/components/logo';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { signIn, session, loading } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  if (session) {
    return <Navigate to="/home" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      rememberMe: checked
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn(formData.identifier, formData.password, formData.rememberMe);
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-nox-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <div className="nox-card mb-6">
          <h2 className="text-2xl font-bold text-center mb-6">Entrar</h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-nox-error p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-nox-textSecondary mb-1">
                E-mail
              </label>
              <Input
                id="identifier"
                name="identifier"
                className="nox-input"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-nox-textSecondary">
                  Senha
                </label>
                <Link to="/forgot-password" className="text-xs text-nox-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                className="nox-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex items-center">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={handleCheckboxChange}
                className="data-[state=checked]:bg-nox-primary data-[state=checked]:border-nox-primary"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-nox-textSecondary">
                Manter conectado
              </label>
            </div>
            
            <Button
              type="submit"
              className="nox-button-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
        
        <div className="text-center text-nox-textSecondary">
          <p className="text-sm">
            Não tem uma conta?{' '}
            <Link to="/signup" className="text-nox-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
