
import { useState, useEffect } from 'react';
import { Sale } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSales, setPendingSales] = useState<Sale[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Connection restored. Click sync to upload pending sales.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Working offline. Sales will be saved locally.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending sales from localStorage
    const stored = localStorage.getItem('pending_sales');
    if (stored) {
      setPendingSales(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveSaleOffline = (sale: Sale) => {
    const updated = [...pendingSales, sale];
    setPendingSales(updated);
    localStorage.setItem('pending_sales', JSON.stringify(updated));
  };

  const syncPendingSales = async () => {
    if (pendingSales.length === 0) {
      toast({
        title: "Nothing to Sync",
        description: "No pending sales to upload."
      });
      return;
    }

    try {
      // In real app, this would upload to server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear pending sales after successful sync
      setPendingSales([]);
      localStorage.removeItem('pending_sales');
      
      toast({
        title: "Sync Complete",
        description: `${pendingSales.length} sales uploaded successfully.`
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Could not upload pending sales. Try again later.",
        variant: "destructive"
      });
    }
  };

  return {
    isOnline,
    pendingSales,
    saveSaleOffline,
    syncPendingSales
  };
}
