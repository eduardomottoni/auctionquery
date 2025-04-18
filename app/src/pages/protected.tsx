import React from 'react';
import styled from 'styled-components';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/hooks/useAuth';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const ProtectedPageContent: React.FC = () => {
    const { user } = useAuth();

  return (
    <Container>
      <Title>Protected Page</Title>
      <p>If you can see this, you are logged in!</p>
      <p>Welcome, {user?.name || 'User'}!</p>
      {/* Add content specific to authenticated users here */}
    </Container>
  );
};

// Wrap the component with the HOC to protect it
const ProtectedPage = withAuth(ProtectedPageContent);

export default ProtectedPage; 