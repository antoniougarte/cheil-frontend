import { useEffect, useState } from 'react';
import { fetchProducts, Product } from '@/services/productService';
import { useAuth } from '@/context/AuthContext';

export function useProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return; // no token, no fetch

    setLoading(true);
    fetchProducts(token)
      .then(setProducts)
      .catch((err) => setError(err.message || 'Error al cargar productos'))
      .finally(() => setLoading(false));
  }, [token]);

  return { products, loading, error };
}
