'use client';

import React from 'react';
import { NotificationProvider, NotificationDisplay } from './NotificationSystem';
import { AnimationController } from './AnimationController';
import { AuthProvider } from './AuthProvider';
import AIAssistant from './AIAssistant';

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
  return <AIAssistant context={context} />;
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
        </NotificationProvider>
      </AnimationController>
    </AuthProvider>
  );
}
