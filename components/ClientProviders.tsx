'use client';

import React from 'react';
import { NotificationProvider, NotificationDisplay } from './NotificationSystem';
import { AnimationController } from './AnimationController';
import { AuthProvider } from './AuthProvider';
import LazyWrapper from './LazyWrapper';

// Lazy load heavy components
const AIAssistant = React.lazy(() => import('./AIAssistant'));
const AnalyticsMount = React.lazy(() => import('./AnalyticsMount'));

function AIWidgetMount() {
  const [enabled, setEnabled] = React.useState(false);
  const [context, setContext] = React.useState<'sales'|'support'|'content'|'general'>('sales');
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/system-settings', { cache: 'no-store' });
        const data = await res.json();
        if (!active) return;
        const ai = data?.data?.settings?.ai || data?.settings?.ai || {};
        setEnabled(!!ai?.enabled);
        setContext(ai?.defaultContext || 'sales');
      } catch {
        setEnabled(false);
      }
    })();
    return () => { active = false; };
  }, []);
  if (!enabled) return null;
  return (
    <LazyWrapper>
      <AIAssistant context={context} />
    </LazyWrapper>
  );
}

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
          <AIWidgetMount />
          <LazyWrapper>
            <AnalyticsMount />
          </LazyWrapper>
        </NotificationProvider>
      </AnimationController>
    </AuthProvider>
  );
}
