'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { IProduct } from '@/contexts/ProductContext'; // Import kiểu Product

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <img className="w-full h-56 object-cover" src={product.image_url} alt={product.name} />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
        <p className="text-gray-600 mb-4 h-12 overflow-hidden">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-indigo-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center"
          >
            <ShoppingCart className="h-5 w-5 mr-2" /> Thêm
          </button>
        </div>
      </div>
    </div>
  );
}