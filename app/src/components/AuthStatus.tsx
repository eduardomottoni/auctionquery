import React from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatusText = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const TimeText = styled.span`
  font-style: italic;
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};
  background-color: ${({ theme }) => theme.colors.textLight};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
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
          <StatusText>Logged In with token: {token}</StatusText>
          <TimeText>Expires in: {formatTime(timeRemaining)}</TimeText>
          <ActionButton onClick={logout}>Logout</ActionButton>
        </>
      ) : (
        <>
          <StatusText>Logged Out</StatusText>
          <ActionButton onClick={handleLoginRedirect}>Login</ActionButton>
        </>
      )}
    </Wrapper>
  );
};

export default AuthStatus; 