import Head from 'next/head';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '@/store'; // Use typed hooks
import {
  fetchVehicles, // Import the async thunk
  selectAllVehicles,
  selectVehiclesStatus,
} from '@/store/vehiclesSlice';

const StyledHeading = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const InfoText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

export default function Home() {
  const dispatch = useDispatch();
  const allVehicles = useSelector(selectAllVehicles);
  const vehiclesStatus = useSelector(selectVehiclesStatus);

  // Fetch vehicles data on component mount
  useEffect(() => {
    // Only fetch if vehicles haven't been loaded yet
    if (vehiclesStatus === 'idle') {
      dispatch(fetchVehicles());
    }
  }, [dispatch, vehiclesStatus]);

  return (
    <>
      <Head>
        <title>Constellation Auction</title>
        <meta name="description" content="Vehicle Auction Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <StyledHeading>Welcome to the Auction!</StyledHeading>
        <InfoText>
          Redux store configured.
        </InfoText>
        {vehiclesStatus === 'loading' && <InfoText>Loading vehicles...</InfoText>}
        {vehiclesStatus === 'succeeded' && (
          <InfoText>
            Total Vehicles Loaded: {allVehicles.length}
          </InfoText>
        )}
        {vehiclesStatus === 'failed' && (
            <InfoText style={{ color: 'red' }}>Error loading vehicles.</InfoText>
        )}
        <InfoText>
          (Check localStorage for 'favorites' and 'lastSearch' keys)
        </InfoText>
      </Container>
    </>
  );
}
