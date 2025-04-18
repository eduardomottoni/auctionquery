import Head from 'next/head';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '@/store'; // Use typed hooks
import {
  setVehiclesSucceeded,
  addFavorite,
  selectFavorites,
} from '@/store/vehiclesSlice';
import { RootState } from '@/store'; // Import RootState

const StyledHeading = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center; // Center text for validation
`;

const InfoText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

// Sample vehicle data for validation
const sampleVehicles = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 25000 },
  { id: 2, make: 'Honda', model: 'Civic', year: 2023, price: 23000 },
  { id: 3, make: 'Ford', model: 'Mustang', year: 2021, price: 35000 },
];

export default function Home() {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const allVehiclesCount = useSelector((state: RootState) => state.vehicles.allVehicles.length);

  // Dispatch actions on component mount for validation
  useEffect(() => {
    dispatch(setVehiclesSucceeded(sampleVehicles));
    dispatch(addFavorite(2)); // Favorite the Honda Civic
  }, [dispatch]);

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
        <InfoText>
          Total Vehicles Loaded: {allVehiclesCount}
        </InfoText>
        <InfoText>
          Favorite Vehicle IDs: {JSON.stringify(favorites)}
        </InfoText>
        <InfoText>
          (Check localStorage for 'favorites' and 'lastSearch' keys)
        </InfoText>
      </Container>
    </>
  );
}
