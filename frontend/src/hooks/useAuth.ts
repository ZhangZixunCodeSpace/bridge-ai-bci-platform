import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return mock data for demo purposes
    return {
      user: null,
      isLoading: false,
      login: async () => {},
      logout: () => {},
      register: async () => {}
    };
  }
  return context;
};

// Mock hook implementation for demo
export const useAuthDemo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: '1',
      email,
      name: 'Demo User',
      avatar: 'https://via.placeholder.com/40'
    });
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: '1',
      email,
      name,
      avatar: 'https://via.placeholder.com/40'
    });
    setIsLoading(false);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    register
  };
};