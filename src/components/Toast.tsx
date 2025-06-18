'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    style: 'bg-green-100 border-green-400 text-green-700',
  },
  error: {
    icon: <XCircle className="h-6 w-6 text-red-500" />,
    style: 'bg-red-100 border-red-400 text-red-700',
  },
  info: {
    icon: <Info className="h-6 w-6 text-blue-500" />,
    style: 'bg-blue-100 border-blue-400 text-blue-700',
  },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  // Tự động đóng thông báo sau 5 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    // Dọn dẹp timer khi component bị unmount
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const config = toastConfig[type];

  return (
    <div
      className={`fixed top-5 right-5 z-[100] max-w-sm rounded-lg border px-4 py-3 shadow-lg ${config.style} animate-slide-in`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="py-1">{config.icon}</div>
        <div className="mx-3">
          <p className="font-semibold">{message}</p>
        </div>
        <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg hover:bg-gray-200">
            <X className="h-5 w-5"/>
        </button>
      </div>
    </div>
  );
}