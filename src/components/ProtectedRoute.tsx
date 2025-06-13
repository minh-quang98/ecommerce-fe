'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Logic chuyển hướng sẽ được xử lý bằng cách hiển thị thông báo và link
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Truy cập bị từ chối</h1>
        <p className="text-gray-700 mt-2">Bạn cần đăng nhập để truy cập trang này.</p>
        <Link href="/login" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300">
          Đi đến trang Đăng nhập
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}