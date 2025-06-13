'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, PlusCircle, LogIn, LogOut, UserPlus, Package, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center cursor-pointer">
          <Package className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-bold text-gray-800">NextShop</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-indigo-600">
            <Home className="h-5 w-5 mr-1" /> Trang chủ
          </Link>
          {user && (
            <Link href="/create-product" className="flex items-center text-gray-600 hover:text-indigo-600">
              <PlusCircle className="h-5 w-5 mr-1" /> Bán hàng
            </Link>
          )}
          <Link href="/cart" className="relative flex items-center text-gray-600 hover:text-indigo-600">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative group">
              <button className="flex items-center text-gray-600">
                <User className="h-6 w-6" />
                <span className="ml-2 hidden md:inline">{user.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 hidden group-hover:block">
                 <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white cursor-pointer">
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    Đăng xuất
                 </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
                <Link href="/login" className="flex items-center bg-transparent border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition duration-300">
                  <LogIn className="h-5 w-5 mr-1" />
                  Đăng nhập
                </Link>
                 <Link href="/register" className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                  <UserPlus className="h-5 w-5 mr-1" />
                  Đăng ký
                </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}