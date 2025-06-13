'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/contexts/ProductContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PlusCircle } from 'lucide-react';

function CreateProductPageContent() {
    const { addProduct } = useProducts();
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [success, setSuccess] = useState('');
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const productData = { name, description, price: parseFloat(price) };
        const result = await addProduct(productData);
        if(result.success) {
            setSuccess(`Sản phẩm "${name}" đã được thêm thành công!`);
            setName('');
            setDescription('');
            setPrice('');
            setTimeout(() => {
                setSuccess('');
                router.push('/');
            }, 2500);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Tạo sản phẩm mới
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {success && <p className="text-green-600 bg-green-100 p-3 rounded-md text-center">{success}</p>}
                    <div className="rounded-md shadow-sm space-y-4">
                        {/* Form fields... */}
                         <div>
                            <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                            <input value={name} onChange={e => setName(e.target.value)} id="product-name" name="name" type="text" required className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="VD: iPhone 15 Pro Max" />
                        </div>
                        <div>
                            <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} id="product-description" name="description" required className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Mô tả chi tiết về sản phẩm"></textarea>
                        </div>
                         <div>
                            <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">Giá (VND)</label>
                            <input value={price} onChange={e => setPrice(e.target.value)} id="product-price" name="price" type="number" required className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="VD: 30000000" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                           <PlusCircle className="w-5 h-5 mr-2" /> Thêm sản phẩm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Bọc page content bằng ProtectedRoute để bảo vệ
export default function CreateProductPage() {
    return (
        <ProtectedRoute>
            <CreateProductPageContent />
        </ProtectedRoute>
    );
}