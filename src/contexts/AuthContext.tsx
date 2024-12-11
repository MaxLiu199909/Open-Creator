import React, { createContext, useContext, useState } from 'react';

interface AuthError {
  message: string;
  code: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  error: AuthError | null;
  login: (provider: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const login = async (provider: string) => {
    try {
      setError(null);
      // Simulate authentication
      if (!provider) {
        throw new Error('Provider is required');
      }
      console.log(`Logging in with ${provider}`);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Failed to authenticate',
        code: 'AUTH_ERROR'
      });
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
