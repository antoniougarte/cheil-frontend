'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="absolute w-full">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link
            className='flex items-center lg:order-1'
            href="/">
            <Image
              src="https://flowbite.com/docs/images/logo.svg"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
              width={36}
              height={36}
              priority
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Products Manager
            </span>
          </Link>
          <div className="flex items-center lg:order-2 space-x-2">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:text-white hover:bg-blue-700 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 dark:hover:text-white">Logout</button>
            ) : (
              <Link href="/login" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:text-white hover:bg-blue-700 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 dark:hover:text-white">Login</Link>
            )}
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  href="/"
                  className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:text-white hover:bg-blue-700 lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 dark:hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:text-white hover:bg-green-700 lg:hover:bg-transparent lg:hover:text-green-700 lg:p-0 dark:text-gray-400 dark:hover:text-white"
                >
                  Products and Categories
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
