import Link from 'next/link';
import styled from 'styled-components';
import Head from 'next/head';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: 6rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  font-size: 1.1rem;
  margin-top: ${({ theme }) => theme.spacing.md};

  &:hover {
    text-decoration: none;
  }
`;

export default function Custom404() {
  return (
    <>
        <Head>
            <title>Page Not Found</title>
        </Head>
        <Container>
        <Title>404</Title>
        <Subtitle>Oops! Looks like this page doesn't exist.</Subtitle>
        <p>We couldn't find the page you were looking for.</p>
        <StyledLink href="/">
            Go back to Homepage
        </StyledLink>
        <StyledLink href="/favorites">
            Go to Favorites
        </StyledLink>
        </Container>
    </>
  );
} 