'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { useLoader } from '@/context/LoaderContext';

export default function LoginPage() {
  const router = useRouter();
  const { setLoading } = useLoader();
  const { login, token } = useAuth(); // <--- accede al token del contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirigir si ya hay token
  useEffect(() => {
    if (token) {
      router.replace('/products'); // evita ir hacia atrás al login
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { access_token } = await loginUser({ email, password });
      login(access_token);
      router.push('/products');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          Products Manager
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
