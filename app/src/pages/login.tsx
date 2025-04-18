import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useDispatch } from '@/store';
import { loginSuccess } from '@/store/authSlice'; // We'll dispatch this

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const LoginButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleGenerateToken = () => {
    // 1. Generate token and expiration
    const now = new Date();
    const expirationTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const authToken = `auth-token-${now.getTime()}`; // Changed prefix
    const genericUser = { id: 'user123', name: 'Authenticated User' }; // Changed name

    // 2. Dispatch login action
    dispatch(loginSuccess({ user: genericUser, token: authToken, expirationTime: expirationTime.getTime() }));

    // 3. Redirect to home page (or intended page)
    router.push('/');
  };

  return (
    <Container>
      <Title>Login Page</Title>
      <p style={{ marginBottom: '2rem' }}>Click the button to simulate login.</p>
      <LoginButton onClick={handleGenerateToken}>
        Generate Token & Login
      </LoginButton>
    </Container>
  );
};

export default LoginPage; 