'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '../../../hooks/useAuth';

const EnhancedLoginForm = dynamic(() => import('../../../components/EnhancedLoginForm'), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200" />,
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/admin';

  const { recheck } = useAuth();

  const handleLoginSuccess = () => {
    recheck();
    router.push(nextUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <EnhancedLoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
