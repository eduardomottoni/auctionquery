import React from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';

const Wrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const StatusText = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
  min-width: 100px;
`;

const TimeText = styled.span`
  font-style: italic;
  white-space: nowrap;
`;

// Helper to format remaining time
const formatTime = (milliseconds: number | null): string => {
  if (milliseconds === null || milliseconds <= 0) return 'Expired';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};

const AuthStatus: React.FC = () => {
  const { isAuthenticated, token, timeRemaining, logout } = useAuth();
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <Wrapper>
      {isAuthenticated && token ? (
        <>
          <StatusText>Token: {token}</StatusText>
          <TimeText>Expires in: {formatTime(timeRemaining)}</TimeText>
          <Button onClick={logout} variant="secondary" size="sm">
              Logout
          </Button>
        </>
      ) : (
        <>
          <StatusText>Logged Out</StatusText>
          <Button onClick={handleLoginRedirect} variant="primary" size="sm">
              Login
          </Button>
        </>
      )}
    </Wrapper>
  );
};

export default AuthStatus; 