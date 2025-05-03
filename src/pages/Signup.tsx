import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from '@/components/logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type StepKey = 'personal' | 'address' | 'income' | 'password';

const SignupSteps = {
  personal: {
    title: 'Dados Pessoais',
    fields: ['name', 'username', 'cpf', 'birthDate', 'email', 'phone']
  },
  address: {
    title: 'Endereço',
    fields: ['postalCode', 'street', 'number', 'complement', 'neighborhood', 'city', 'state']
  },
  income: {
    title: 'Renda e Profissão',
    fields: ['occupation', 'income']
  },
  password: {
    title: 'Criar Senha',
    fields: ['password', 'confirmPassword', 'terms']
  }
};

const initialFormData = {
  // Personal data
  name: '',
  username: '',
  cpf: '',
  birthDate: '',
  email: '',
  phone: '',
  
  // Address
  postalCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  
  // Income
  occupation: '',
  income: '',
  
  // Password
  password: '',
  confirmPassword: '',
  terms: false
};

const Signup = () => {
  const { signUp, session, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<StepKey>('personal');
  const [formData, setFormData] = useState(initialFormData);
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
      terms: checked
    });
  };

  const validateUsername = (username: string): boolean => {
    return /^@?[a-zA-Z0-9_.]+$/.test(username);
  };

  const formatUsername = (username: string): string => {
    // Ensure username starts with @
    if (!username.startsWith('@')) {
      return '@' + username;
    }
    return username;
  };

  const nextStep = () => {
    setError(null); // Limpa erros anteriores
    
    if (currentStep === 'personal') {
      // Validate username
      if (!validateUsername(formData.username)) {
        setError('Nome de usuário inválido. Use apenas letras, números, _ ou .');
        return;
      }
      
      // Validar email
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError('E-mail inválido.');
        return;
      }
      
      // Validar CPF (formato básico)
      if (formData.cpf.length < 11) {
        setError('CPF inválido.');
        return;
      }
      
      setCurrentStep('address');
    } else if (currentStep === 'address') setCurrentStep('income');
    else if (currentStep === 'income') setCurrentStep('password');
  };

  const prevStep = () => {
    setError(null); // Limpa erros anteriores
    if (currentStep === 'password') setCurrentStep('income');
    else if (currentStep === 'income') setCurrentStep('address');
    else if (currentStep === 'address') setCurrentStep('personal');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep !== 'password') {
      nextStep();
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (!formData.terms) {
      setError('Você precisa aceitar os termos de uso');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedUsername = formatUsername(formData.username);
      await signUp(formData.email, formData.password, formattedUsername, formData.name);
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      
      // Mostrar toast mesmo quando o erro já foi tratado no context
      if (!error.message) {
        toast({
          title: 'Erro ao criar conta',
          description: 'Verifique as informações e tente novamente.',
          variant: 'destructive',
        });
      }
      
      setIsLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-nox-textSecondary mb-1">
                Nome Completo
              </label>
              <Input
                id="name"
                name="name"
                className="nox-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-nox-textSecondary mb-1">
                Nome de Usuário
              </label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  className="nox-input pl-6"
                  value={formData.username}
                  onChange={(e) => {
                    // Remove @ if user types it (we'll add it later)
                    const value = e.target.value.startsWith('@') 
                      ? e.target.value.substring(1) 
                      : e.target.value;
                    setFormData({
                      ...formData,
                      username: value
                    });
                  }}
                  placeholder="seuusername"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nox-textSecondary">@</span>
              </div>
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-nox-textSecondary mb-1">
                CPF
              </label>
              <Input
                id="cpf"
                name="cpf"
                className="nox-input"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-nox-textSecondary mb-1">
                Data de Nascimento
              </label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                className="nox-input"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-nox-textSecondary mb-1">
                E-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                className="nox-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-nox-textSecondary mb-1">
                Telefone
              </label>
              <Input
                id="phone"
                name="phone"
                className="nox-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 'address':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-nox-textSecondary mb-1">
                  CEP
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  className="nox-input"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-nox-textSecondary mb-1">
                  Rua
                </label>
                <Input
                  id="street"
                  name="street"
                  className="nox-input"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-nox-textSecondary mb-1">
                  Número
                </label>
                <Input
                  id="number"
                  name="number"
                  className="nox-input"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="complement" className="block text-sm font-medium text-nox-textSecondary mb-1">
                  Complemento
                </label>
                <Input
                  id="complement"
                  name="complement"
                  className="nox-input"
                  value={formData.complement}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-nox-textSecondary mb-1">
                Bairro
              </label>
              <Input
                id="neighborhood"
                name="neighborhood"
                className="nox-input"
                value={formData.neighborhood}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-nox-textSecondary mb-1">
                  Cidade
                </label>
                <Input
                  id="city"
                  name="city"
                  className="nox-input"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-nox-textSecondary mb-1">
                  Estado
                </label>
                <Input
                  id="state"
                  name="state"
                  className="nox-input"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </>
        );
      case 'income':
        return (
          <>
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-nox-textSecondary mb-1">
                Profissão
              </label>
              <Input
                id="occupation"
                name="occupation"
                className="nox-input"
                value={formData.occupation}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="income" className="block text-sm font-medium text-nox-textSecondary mb-1">
                Renda Mensal (R$)
              </label>
              <Input
                id="income"
                name="income"
                className="nox-input"
                value={formData.income}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 'password':
        return (
          <>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-nox-textSecondary mb-1">
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                className="nox-input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-nox-textSecondary mb-1">
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="nox-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={handleCheckboxChange}
                className="data-[state=checked]:bg-nox-primary data-[state=checked]:border-nox-primary"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-nox-textSecondary">
                Li e concordo com os <span className="text-nox-primary cursor-pointer">Termos de Uso</span> e <span className="text-nox-primary cursor-pointer">Política de Privacidade</span>
              </label>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-nox-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <div className="nox-card mb-6">
          <h2 className="text-2xl font-bold text-center mb-2">Cadastre-se</h2>
          <p className="text-nox-textSecondary text-center text-sm mb-6">
            Preencha os dados abaixo para criar sua conta
          </p>
          
          <Tabs value={currentStep} className="mb-6">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="personal" disabled>1. Pessoal</TabsTrigger>
              <TabsTrigger value="address" disabled>2. Endereço</TabsTrigger>
              <TabsTrigger value="income" disabled>3. Renda</TabsTrigger>
              <TabsTrigger value="password" disabled>4. Senha</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-nox-error p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderFormFields()}
            
            <div className="flex justify-between pt-4">
              {currentStep !== 'personal' ? (
                <Button
                  type="button"
                  className="nox-button-secondary"
                  onClick={prevStep}
                >
                  Voltar
                </Button>
              ) : (
                <Link to="/login" className="nox-button-secondary">
                  Cancelar
                </Link>
              )}
              
              <Button
                type="submit"
                className="nox-button-primary"
                disabled={isLoading}
              >
                {currentStep === 'password'
                  ? (isLoading ? "Cadastrando..." : "Finalizar Cadastro") 
                  : "Continuar"
                }
              </Button>
            </div>
          </form>
        </div>
        
        {currentStep === 'personal' && (
          <div className="text-center text-nox-textSecondary">
            <p className="text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-nox-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
