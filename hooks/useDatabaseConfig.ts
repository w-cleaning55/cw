import { useState, useEffect, useCallback } from 'react';
import { databaseSwitcher, DatabaseConfig, DatabaseType } from '../utils/databaseSwitcher';

export function useDatabaseConfig() {
  const [config, setConfig] = useState<DatabaseConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const loaded = await databaseSwitcher.loadSavedConfig();
        if (loaded) {
          setConfig(databaseSwitcher.getCurrentConfig());
          setIsConnected(true);
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
      const success = await databaseSwitcher.setConfig(newConfig);
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
      return await databaseSwitcher.testConnection(testConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
      return false;
    }
  }, []);

  const getAdapter = useCallback(() => {
    return databaseSwitcher.getAdapter();
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
