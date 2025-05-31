import './globals.css';
import { ReactNode } from 'react';
import Header from '../components/Header';
import { AuthProvider } from '@/context/AuthContext';
import { LoaderProvider } from '@/context/LoaderContext';
import LoaderClientWrapper from '@/components/LoaderClientWrapper';

export const metadata = {
  title: 'Proyecto Full Stack',
  description: 'Frontend con Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <LoaderProvider>
            <Header />
            <main>
              <LoaderClientWrapper>
                {children}
              </LoaderClientWrapper>
            </main>
          </LoaderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
