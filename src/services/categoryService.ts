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
  // Extraemos solo el array data que contiene las categorías
  return responseJson.data;
}


