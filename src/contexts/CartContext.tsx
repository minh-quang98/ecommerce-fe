'use client';

import React, { useState, useContext, createContext, useMemo, useCallback } from 'react';
import { IProduct } from './ProductContext';
import { ENDPOINTS_API } from '@/constants/constants';

// Định nghĩa kiểu cho một item trong giỏ hàng
export interface ICartItem extends IProduct {
  quantity: number;
}

interface ICartContext {
  cartItems: ICartItem[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<ICartContext | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  const addToCart = useCallback(async (product: IProduct) => {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      const dataUser = JSON.parse(localStorage.getItem('dataUser') || '');
      console.log('check>>token', token);
      
      if (!token) {
        console.error("No token found. User is not authenticated.");
        return { success: false, message: "Bạn cần đăng nhập để thực hiện việc này." };
      }
      const response = await fetch(`${ENDPOINTS_API.ORDER}/addProductToCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Gắn token vào header
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idProduct: product.id,
          price: product.price,
          idCustomer: dataUser?.id || ''
        })
      })

      console.log('check>>', response);
      
    } catch (err) {

    }
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    const newQuantity = Math.max(1, quantity);
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}