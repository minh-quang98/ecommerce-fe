'use client';

import { useProducts } from '@/contexts/ProductContext';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const { products } = useProducts();
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sản phẩm nổi bật</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? products.map(product => (
          <ProductCard key={product.id} product={product} />
        )) : <div>Không có sản phẩm</div>}
      </div>
    </div>
  );
}