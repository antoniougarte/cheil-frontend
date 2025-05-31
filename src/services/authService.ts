import { API_BASE_URL } from "@/app/libs/constants";
import { parseApiResponse } from "@/utils/apiResponse";

interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<LoginResponse>(res);
}
