'use client';

import { fetchProducts, deleteProduct, Product } from '@/services/productService';
import { useEffect, useState } from 'react';

interface TableProductsProps {
  token: string | null;
  onEditProduct?: (product: Product) => void;
}

export default function TableProducts({ token, onEditProduct }: TableProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const { data, total, page: currentPage, lastPage } = await fetchProducts(token, page, limit);
        setProducts(data);
        setTotal(total);
        setPage(currentPage);
        setLastPage(lastPage);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token, page]);

  const handleDelete = async (productId: string) => {
    if (!token) return;
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    try {
      await deleteProduct(token, productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Error:', err);
      alert('Hubo un error al eliminar el producto');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
      <div className="mx-auto max-w-screen-2xl">
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between">
            <h5 className="text-gray-500 dark:text-white">
              Total Products: <span className="font-semibold">{total}</span>
            </h5>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Last Update</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded mr-3" />
                        ) : (
                          <div className="w-10 h-10 mr-3 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            Sin imagen
                          </div>
                        )}
                        {product.name}
                      </td>
                      <td className="px-4 py-2">{product.category?.name || 'Uncategorized'}</td>
                      <td className="px-4 py-2">${product.price}</td>
                      <td className="px-4 py-2">-</td>
                      <td className="px-4 py-2">{new Date(product.updatedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                        onClick={() => onEditProduct && onEditProduct(product)}
                        className="px-2 py-1 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        >
                        Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} de {lastPage}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
