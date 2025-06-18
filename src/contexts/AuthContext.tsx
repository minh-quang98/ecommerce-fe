'use client';

import React, { useState, useContext, createContext, useMemo, useCallback, useEffect } from 'react';
import { ENDPOINTS_API } from '@/constants/constants';
import { useToast } from './ToastContext';


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
  const { showToast } = useToast();

  useEffect(() => {
    const dataUser = localStorage.getItem('dataUser')
    if (dataUser) {
      setUser(JSON.parse(dataUser));
    }
  }, [])

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
      localStorage.setItem('dataUser', JSON.stringify(data.user));
      // Lưu thông tin user vào state
      setUser(data.user);
      showToast('Đăng nhập thành công', "success")
      return { success: true };
    } else {
      // Xử lý lỗi
      const errorData = await response.json(); // Lấy thông tin lỗi từ response
      return { success: false, message: errorData.message };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await fetch(`${ENDPOINTS_API.AUTH}/register`, {  // Đặt trong dấu nháy
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (response.ok) {
      // const data = await response.json();
      return { success: true };
    } else {
      const errorData = await response.json(); // Lấy thông tin lỗi từ response
      return { success: false, error: errorData }; // Trả về thông tin lỗi
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('dataUser');
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