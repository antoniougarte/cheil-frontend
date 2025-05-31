'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TableProducts from '@/components/TableProducts';
import ProductForm from '@/components/ProductForm';
import { useAuth } from '@/context/AuthContext';
import { Category, fetchCategories } from '@/services/categoryService';
import { Product } from '@/services/productService';
import CategoryManager from '@/components/CategoryManager';

export default function ProductosPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [productsRefreshKey, setProductsRefreshKey] = useState(0);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const refetchCategories = () => {
    if (!token) return;
    fetchCategories(token).then(setCategories).catch(console.error);
  };

  useEffect(() => {
    refetchCategories();
  }, [token]);

  if (!isAuthenticated) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Listado de Productos</h2>

      <CategoryManager
        token={token!}
        initialCategories={categories}
        onCategoryChange={refetchCategories}
      />

      <ProductForm
        token={token!}
        categories={categories}
        productToEdit={productToEdit}
        onCreate={() => setProductsRefreshKey((k) => k + 1)}
        onUpdate={() => {
          setProductsRefreshKey((k) => k + 1);
          setProductToEdit(null);
        }}
        onCancelEdit={() => setProductToEdit(null)}
      />

      <TableProducts
        token={token}
        key={productsRefreshKey}
        onEditProduct={(prod) => setProductToEdit(prod)}
      />
    </div>
  );
}
