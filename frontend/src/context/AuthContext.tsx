'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  badges: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleAuth: (email: string, name: string, avatar?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('dsa_token');
      if (token) {
        const res = await api.get('/auth/me');
        setUser(res.user);
      } else {
        // Auto-login seeded demo user
        try {
          const res = await api.post('/auth/login', { email: 'demo@masteryhub.com', password: 'password123' });
          localStorage.setItem('dsa_token', res.token);
          setUser(res.user);
        } catch (authErr) {
          console.error('Silent auto-login failed:', authErr);
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      localStorage.removeItem('dsa_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('dsa_token', res.token);
      setUser(res.user);
      router.push('/');
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('dsa_token', res.token);
      setUser(res.user);
      router.push('/');
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const googleAuth = async (email: string, name: string, avatar?: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { email, name, avatar });
      localStorage.setItem('dsa_token', res.token);
      setUser(res.user);
      router.push('/');
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('dsa_token');
    setUser(null);
    router.push('/problems');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleAuth, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
