// src/components/Layout/OfflineBanner.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 text-sm flex items-center gap-2">
      <AlertTriangle className="w-4 h-4" />
      You are offline. Sales will be saved locally until connection is restored.
    </div>
  );
};
