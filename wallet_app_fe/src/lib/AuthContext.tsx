import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${baseUrl}/auth/login`, {
        email: email,
        password: password
      })
      setUser(res.data.user)
    } catch (error) {
      console.log('error', error)
      throw error;
    }
  };

  const signUp = async (username: string, email: string, password: string, confirmPassword: string) => {
    try {
      const res = await axios.post(`${baseUrl}/auth/register`, {
        username,
        email,
        password,
        confirmPassword
      })
      setUser(res.data.user)
    } catch (error) {
      console.log('error', error)
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null)
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
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