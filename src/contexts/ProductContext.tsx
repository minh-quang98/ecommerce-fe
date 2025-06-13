'use client';

import React, { useState, useContext, createContext, useMemo, useCallback, useEffect } from 'react';
import { ENDPOINTS_API } from '../constants/constants';
// Định nghĩa và export interface cho Product để các file khác có thể sử dụng
export interface IProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
}

interface IProductContext {
  products: IProduct[];
  addProduct: (productData: Omit<IProduct, 'id' | 'image_url'>) => any;
}

const initialProducts: IProduct[] = [];

const ProductContext = createContext<IProductContext | null>(null);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);

  // Dùng useEffect để gọi API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // URL của backend API
        const response = await fetch(`${ENDPOINTS_API.PRODUCTS}/getAllProducts`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('check>>>', response);
        
        const data: IProduct[] = await response.json();

        console.log('check>>>dâta', data);
        
        setProducts(data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Có thể set state lỗi để hiển thị thông báo cho người dùng
      }
    };

    fetchProducts();
  }, []); // Mảng rỗng `[]` đảm bảo useEffect chỉ chạy 1 lần

  const addProduct = useCallback(async (productData: Omit<IProduct, 'id' | 'image_url'>) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No token found. User is not authenticated.");
      return { success: false, message: "Bạn cần đăng nhập để thực hiện việc này." };
    }

    try {
      const response = await fetch(`${ENDPOINTS_API.PRODUCTS}/createProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Gắn token vào header
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      // Tùy chọn: fetch lại danh sách sản phẩm hoặc thêm sản phẩm mới vào state
      // Để đơn giản, ta sẽ fetch lại toàn bộ danh sách
      const productsResponse = await fetch(`${ENDPOINTS_API.PRODUCTS}/getAllProducts`);
      const updatedProducts = await productsResponse.json();
      setProducts(updatedProducts);

      return { success: true, message: "Thêm mới thành công" };

    } catch (error) {
      console.error("Failed to create product:", error);
      return { success: false, message: "" };
    }
  }, []);

  const value = useMemo(() => ({ products, addProduct }), [products, addProduct]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}