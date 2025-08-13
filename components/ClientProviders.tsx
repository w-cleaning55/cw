'use client';

import React from 'react';
import { NotificationProvider, NotificationDisplay } from './NotificationSystem';
import { AnimationController } from './AnimationController';
import { AuthProvider } from './AuthProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <AnimationController>
        <NotificationProvider>
          {children}
          <NotificationDisplay />
        </NotificationProvider>
      </AnimationController>
    </AuthProvider>
  );
}
