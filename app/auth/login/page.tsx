'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('../../../components/LoginForm'), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200" />,
});

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
