import { useSelector, useDispatch } from '@/store';
import { logout, checkTokenValidity, selectIsAuthenticated as selectIsAuthValid } from '@/store/authSlice';
import { useEffect, useState, useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();

  // Select relevant state from Redux
  const isAuthenticated = useSelector(selectIsAuthValid); // Use the selector that checks expiration
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const expirationTime = useSelector((state) => state.auth.expirationTime);
  const authStatus = useSelector((state) => state.auth.status);

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Function to handle logout
  const handleLogout = useCallback(() => {
    dispatch(logout());
    // Optionally redirect or clear other state here
  }, [dispatch]);

  // Effect to check token validity periodically and calculate remaining time
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const updateRemainingTime = () => {
        if (isAuthenticated && expirationTime) {
            const now = Date.now();
            const remaining = Math.max(0, expirationTime - now);
            setTimeRemaining(remaining);
            if (remaining === 0) {
                // Token just expired, dispatch check/logout
                dispatch(checkTokenValidity());
            }
        } else {
            setTimeRemaining(null);
        }
    };

    if (isAuthenticated && expirationTime) {
      // Initial check
      dispatch(checkTokenValidity());
      updateRemainingTime();

      // Set up interval to check validity and update remaining time every second
      intervalId = setInterval(updateRemainingTime, 1000);
    } else {
        setTimeRemaining(null);
    }

    // Cleanup interval on unmount or when auth state changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated, expirationTime, dispatch]);

  return {
    isAuthenticated,
    user,
    token,
    expirationTime,
    timeRemaining, // in milliseconds
    isLoading: authStatus === 'loading',
    logout: handleLogout,
  };
}; 