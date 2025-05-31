'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/services/categoryService';
import { Product, createProduct, updateProduct } from '@/services/productService';

interface ProductFormProps {
  token: string;
  categories: Category[];
  productToEdit?: Product | null;
  onCreate: () => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
}

export default function ProductForm({
  token,
  categories,
  productToEdit = null,
  onCreate,
  onUpdate,
  onCancelEdit,
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price.toString());
      setImageUrl(productToEdit.imageUrl || '');
      setCategoryId(productToEdit.categoryId?.toString() || '');
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setCategoryId('');
    }
    setErrorMessage(null);
  }, [productToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!name.trim()) {
      setErrorMessage('El nombre es obligatorio');
      return;
    }
    if (!price || isNaN(Number(price))) {
      setErrorMessage('El precio debe ser un número válido');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Debe seleccionar una categoría');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const productData: Partial<Product> = {
      name,
      description: description.trim() || undefined,
      price: Number(price),
      imageUrl: imageUrl.trim() || undefined,
      categoryId: parseInt(categoryId),
    };

    try {
      if (productToEdit) {
        await updateProduct(token, productToEdit.id, productData);
        onUpdate();
      } else {
        await createProduct(token, productData);
        onCreate();
      }
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setCategoryId('');
      setErrorMessage(null);
    } catch (error) {
      // Aquí hacemos un type guard para asegurarnos que error tiene message
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('No se pudo guardar el producto');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 shadow-md rounded sm:rounded-lg max-w-screen-2xl mx-auto p-6 mb-6">
      {errorMessage && (
        <div className="mb-4 text-red-600 font-semibold">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Categoría *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Precio *
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Imagen URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? productToEdit
                ? 'Actualizando...'
                : 'Creando...'
              : productToEdit
              ? 'Actualizar producto'
              : 'Crear producto'}
          </button>

          {productToEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-gray-400 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
