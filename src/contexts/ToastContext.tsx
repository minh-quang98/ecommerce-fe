'use client';

import React, { useState, useContext, createContext, useCallback } from 'react';
import Toast from '@/components/Toast';

// Định nghĩa các kiểu cho Toast
type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
}

interface IToastContext {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<IToastContext | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  // Dùng useCallback để tránh re-render không cần thiết
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Component Toast sẽ được render ở đây, 
        luôn tồn tại trong cây DOM và chỉ hiển thị khi có state.
      */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

// Custom hook để sử dụng toast một cách tiện lợi
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}