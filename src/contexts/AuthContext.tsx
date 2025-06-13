'use client';

import React, { useState, useContext, createContext, useMemo, useCallback } from 'react';
import { ENDPOINTS_API } from '../constants/constants';

// Định nghĩa các kiểu dữ liệu (Interfaces)
interface IUser {
  name: string;
  email: string;
}

interface IAuthContext {
  user: IUser | null;
  login: (email: string, password: string) => any;
  logout: () => void;
  register: (name: string, email: string, password: string) => any;
}

// Khởi tạo Context với kiểu đã định nghĩa
const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<any[]>([]); // Trong dự án thực tế, đây sẽ là kiểu User từ database

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${ENDPOINTS_API.AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      // Lưu token vào localStorage
      localStorage.setItem('token', data.token);
      // Lưu thông tin user vào state
      setUser(data.user);
      return { success: true };
    } else {
      // Xử lý lỗi
      return { success: false };
    }
  }, [users]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    // if (users.some(u => u.email === email)) {
    //   return { success: false, message: 'Email này đã được sử dụng.' };
    // }
    // setUsers(prev => [...prev, { name, email, password }]);
    // return { success: true };
    const response = await fetch(`${ENDPOINTS_API.AUTH}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (response.ok) {
      // const data = await response.json();
      return { success: true };
    } else {
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
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