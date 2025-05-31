// components/CategoryForm.tsx
'use client';

import { useState } from 'react';
import { createCategory } from '@/services/categoryService';
import { Category } from '@/services/categoryService';

interface Props {
  token: string;
  onCategoryCreated: (newCategory: Category) => void;
}

export default function CategoryForm({ token, onCategoryCreated }: Props) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newCategory = await createCategory(token, { name, imageUrl });
      onCategoryCreated(newCategory);
      setName('');
      setImageUrl('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('No se pudo crear la categoría');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Crear nueva categoría</h3>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre de categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="URL de imagen"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isSubmitting}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 col-span-1 md:col-span-2"
        >
          {isSubmitting ? 'Creando...' : 'Crear Categoría'}
        </button>
      </form>
    </section>
  );
}
