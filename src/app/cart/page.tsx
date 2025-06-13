'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const router = useRouter();

  const handleCheckout = () => {
    setCheckoutMessage('Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được ghi nhận.');
    clearCart();
    setTimeout(() => {
      setCheckoutMessage('');
      router.push('/');
    }, 3000);
  }

  if (checkoutMessage) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-green-600">{checkoutMessage}</h1>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-700">Giỏ hàng của bạn đang trống</h1>
        <Link href="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300">
          Tiếp tục mua sắm
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Giỏ hàng</h1>
      <div className="lg:flex lg:space-x-8">
        {/* Cart items list */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <img className="w-20 h-20 object-cover rounded-md" src={item.image_url} alt={item.name} />
                  <div className="ml-4">
                    <h2 className="font-bold text-lg text-gray-800">{item.name}</h2>
                    <p className="text-gray-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1">-</button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Cart summary */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Tổng cộng</h2>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">Tạm tính</span>
              <span className="font-bold text-gray-800">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="font-bold text-gray-800">Miễn phí</span>
            </div>
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <span className="text-xl font-bold text-gray-800">Thành tiền</span>
              <span className="text-xl font-bold text-indigo-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
            </div>
            <button onClick={handleCheckout} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300">
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}