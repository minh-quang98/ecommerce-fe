'use client';

import React, { useState, useContext, createContext, useMemo, useCallback } from 'react';

// Định nghĩa các kiểu dữ liệu (Interfaces)
interface IUser {
  name: string;
  email: string;
}

interface IAuthContext {
  user: IUser | null;
  login: (email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  register: (name: string, email: string, password: string) => { success: boolean; message?: string };
}

// Khởi tạo Context với kiểu đã định nghĩa
const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<any[]>([]); // Trong dự án thực tế, đây sẽ là kiểu User từ database

  const login = useCallback((email: string, password: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser({ email: foundUser.email, name: foundUser.name });
      return { success: true };
    }
    return { success: false, message: 'Email hoặc mật khẩu không đúng.' };
  }, [users]);

  const register = useCallback((name: string, email: string, password: string) => {
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email này đã được sử dụng.' };
    }
    setUsers(prev => [...prev, { name, email, password }]);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout, register }), [user, login, logout, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook để sử dụng context dễ dàng hơn
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}