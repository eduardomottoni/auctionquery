import Head from 'next/head';
import styled from 'styled-components';

const StyledHeading = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>Constellation Auction</title>
        <meta name="description" content="Vehicle Auction Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <StyledHeading>Welcome to the Auction!</StyledHeading>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Theme and global styles are set up.
        </p>
      </Container>
    </>
  );
}
