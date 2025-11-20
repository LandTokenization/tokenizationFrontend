import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

// Hook for smooth navigation with loading states
export function useNavigation() {
  const navigate = useNavigate();

  const navigateTo = useCallback(
    (path: string, delay: number = 300) => {
      setTimeout(() => navigate(path), delay);
    },
    [navigate]
  );

  const navigateToLogin = useCallback(() => navigateTo('/login'), [navigateTo]);
  const navigateToDashboard = useCallback(() => navigateTo('/dashboard'), [navigateTo]);
  const navigateToHome = useCallback(() => navigateTo('/'), [navigateTo]);

  return { navigate, navigateTo, navigateToLogin, navigateToDashboard, navigateToHome };
}

// Hook for managing async action states
export function useAsyncAction() {
  const [isLoading, setIsLoading] = require('react').useState(false);
  const [error, setError] = require('react').useState<string | null>(null);

  const execute = useCallback(
    async (fn: () => Promise<void>) => {
      setIsLoading(true);
      setError(null);
      try {
        await fn();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { isLoading, error, execute, reset };
}
