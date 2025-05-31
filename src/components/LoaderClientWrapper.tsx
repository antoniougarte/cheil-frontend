'use client';

import { ReactNode } from 'react';
import { useLoader } from '@/context/LoaderContext';
import Spinner from './Spinner';

export default function LoaderClientWrapper({ children }: { children: ReactNode }) {
  const { isLoading } = useLoader();

  return (
    <>
      {isLoading && <Spinner />}
      {children}
    </>
  );
}
