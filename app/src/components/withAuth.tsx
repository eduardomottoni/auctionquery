import React, { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

// Simple loading component (optional)
const LoadingComponent = () => <div>Loading authentication status...</div>;

const withAuth = <P extends object>(
    WrappedComponent: ComponentType<P>,
    options: { // Optional options for different behaviours
        redirectTo?: string;
        showLoading?: boolean;
    } = {}
) => {
    const { redirectTo = '/login', showLoading = true } = options;

    const WithAuthComponent = (props: P) => {
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            // If finished loading and not authenticated, redirect
            if (!isLoading && !isAuthenticated) {
                router.replace(redirectTo);
            }
        }, [isLoading, isAuthenticated, router, redirectTo]);

        // While loading, optionally show a loading indicator
        if (isLoading && showLoading) {
            return <LoadingComponent />;
        }

        // If authenticated, render the wrapped component
        if (isAuthenticated) {
            return <WrappedComponent {...props} />;
        }

        // If not authenticated and not loading (or not showing loading),
        // render null while the redirect happens.
        return null;
    };

    // Set display name for better debugging
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithAuthComponent.displayName = `withAuth(${displayName})`;

    return WithAuthComponent;
};

export default withAuth; 