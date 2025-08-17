import { useState, useEffect, useCallback } from 'react';
import { databaseManager, DatabaseConfig, DatabaseType } from '../lib/database/index';

export function useDatabaseConfig() {
  const [config, setConfig] = useState<DatabaseConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Try to read current config from manager
        const current = databaseManager.getCurrentConfig?.() || null;
        if (current) {
          setConfig(current);
          setIsConnected(databaseManager.isConnected());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load database config');
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateConfig = useCallback(async (newConfig: DatabaseConfig): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await databaseManager.switchDatabase(newConfig);
      if (success) {
        setConfig(newConfig);
        setIsConnected(true);
        return true;
      } else {
        setError('Failed to connect to database');
        setIsConnected(false);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Database configuration failed';
      setError(errorMessage);
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testConnection = useCallback(async (testConfig: DatabaseConfig): Promise<boolean> => {
    try {
      // Initialize temporarily to test
      return await databaseManager.initialize(testConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
      return false;
    }
  }, []);

  const getAdapter = useCallback(() => {
    return null as any; // adapter abstraction not used in this implementation
  }, []);

  return {
    config,
    isConnected,
    isLoading,
    error,
    updateConfig,
    testConnection,
    getAdapter
  };
}
