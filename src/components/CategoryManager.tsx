'use client';

import { useState, useEffect } from 'react';
import { Category, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';

interface CategoryManagerProps {
  token: string;
  initialCategories: Category[];
  onCategoryChange: () => void;
}

export default function CategoryManager({ token, initialCategories, onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newName, setNewName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createCategory(token, { name: newName.trim(), imageUrl: newImageUrl.trim() || undefined });
      setNewName('');
      setNewImageUrl('');
      onCategoryChange();
    } catch (e) {
        console.error(e);
      setError('Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async () => {
    if (!editingName.trim() || editingId === null) {
      setError('El nombre es obligatorio');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateCategory(token, editingId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName('');
      onCategoryChange();
    } catch (e) {
        console.error(e);
      setError('Error al actualizar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure to want to delete this category?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteCategory(token, id);
      onCategoryChange();
    } catch (e) {
        console.error(e);
      setError('Error al eliminar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 shadow-md rounded sm:rounded-lg max-w-screen-2xl mx-auto p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Category form</h3>
      <p className='my-2 text-white'>Important: If the category has associated products, it cannot be deleted. You must first delete the products.</p>

      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}

      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Category's name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={loading}
          className="mb-2 md:mb-0 px-4 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="text"
          placeholder="URL image (optional)"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          disabled={loading}
          className="mb-2 md:mb-0 px-4 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create category'}
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-500 dark:text-white">ID</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-500 dark:text-white">Name</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-500 dark:text-white">Image</th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-500 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-500 dark:text-white">{cat.id}</td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-500 dark:text-white">
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    disabled={loading}
                    className="px-2 py-1 border rounded dark:bg-gray-700 dark:text-gray-100 w-full"
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  '-'
                )}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 space-x-2">
                {editingId === cat.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={loading}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(cat)}
                      disabled={loading}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
