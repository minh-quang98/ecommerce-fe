import { Inter } from 'next/font/google';
import './globals.css'; // File CSS global, nơi bạn import Tailwind CSS
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NextShop - Mua sắm trực tuyến',
  description: 'Dự án website bán hàng bằng Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <div className="bg-gray-100 min-h-screen font-sans">
                <Header />
                <main>{children}</main>
                <footer className="bg-gray-800 text-white text-center p-4 mt-8">
                    <p>&copy; 2024 NextShop. All rights reserved.</p>
                </footer>
              </div>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}