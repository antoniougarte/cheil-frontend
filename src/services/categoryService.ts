import { API_BASE_URL } from "@/app/libs/constants";

export interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchCategories(token: string): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error al cargar categorías');
  }

  const responseJson = await res.json();
  return responseJson.data;
}

export async function createCategory(
  token: string,
  data: { name: string; imageUrl?: string }
): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error al crear la categoría');
  }

  const responseJson = await res.json();
  return responseJson.data;
}

export async function updateCategory(
  token: string,
  id: number,
  data: { name: string; imageUrl?: string }
): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error al actualizar la categoría');
  }

  const responseJson = await res.json();
  return responseJson.data;
}

export async function deleteCategory(
  token: string,
  id: number
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error al eliminar la categoría');
  }
}
