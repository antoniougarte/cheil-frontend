import { API_BASE_URL } from "@/app/libs/constants";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId?: number;
  category: {
    id: number;
    name: string;
  };
  updatedAt: string;
}

async function handleErrorResponse(res: Response) {
  let errorMessage = `Error: ${res.status} ${res.statusText}`;
  try {
    const json = await res.json();
    if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
      errorMessage = json.errors.join(", ");
    } else if (json.message) {
      errorMessage = json.message;
    }
  } catch {
    // Si no se pudo parsear JSON, dejamos el mensaje genérico
  }
  throw new Error(errorMessage);
}

export async function fetchProducts(
  token?: string,
  page = 1,
  limit = 10
): Promise<{
  data: Product[];
  total: number;
  page: number;
  lastPage: number;
}> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    await handleErrorResponse(res);
  }

  const json = await res.json();
  const { data, total, page: currentPage, lastPage } = json.data;

  return {
    data,
    total,
    page: currentPage,
    lastPage,
  };
}

export async function createProduct(token: string, productData: Partial<Product>) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    await handleErrorResponse(res);
  }

  return res.json();
}

export async function deleteProduct(token: string, productId: string) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    await handleErrorResponse(res);
  }

  return true;
}

export async function updateProduct(token: string, productId: string, productData: Partial<Product>) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    await handleErrorResponse(res);
  }

  return res.json();
}
