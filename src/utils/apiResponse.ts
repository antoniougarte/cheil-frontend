export async function parseApiResponse<T>(res: Response): Promise<T> {
  const json = await res.json();

  if (!res.ok || json.status >= 400 || json.errors) {
    const message = json.message || 'Error desconocido';
    throw new Error(message);
  }

  return json.data as T;
}
