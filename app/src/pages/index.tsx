import Head from 'next/head';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@/store';
import {
  fetchVehicles,
  selectPaginatedVehicles,
  selectVehiclesStatus,
  selectFilteredVehiclesCount,
} from '@/store/vehiclesSlice';
import { setPage } from '@/store/searchSlice';
import { RootState } from '@/store';
import VehicleGrid from '@/components/vehicles/VehicleGrid';
import VehicleList from '@/components/vehicles/VehicleList';
import ViewToggle, { ViewMode } from '@/components/vehicles/ViewToggle';
import FilterSortControls from '@/components/search/FilterSortControls';
import Pagination from '@/components/ui/Pagination';
import withAuth from '@/components/withAuth';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StyledHeading = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InfoText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  text-align: center;
`;

function HomePageContent() {
  const dispatch = useDispatch();
  const vehicles = useSelector(selectPaginatedVehicles);
  const vehiclesStatus = useSelector(selectVehiclesStatus);
  const pagination = useSelector((state: RootState) => state.search.pagination);
  const totalFilteredItems = useSelector(selectFilteredVehiclesCount);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    if (vehiclesStatus === 'idle') {
      dispatch(fetchVehicles());
    }
  }, [dispatch, vehiclesStatus]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const renderVehicleView = () => {
    if (vehiclesStatus === 'loading') {
      return <InfoText>Loading vehicles...</InfoText>;
    }
    if (vehiclesStatus === 'failed') {
        return <InfoText style={{ color: 'red' }}>Error loading vehicles.</InfoText>;
    }
    if (vehiclesStatus === 'succeeded') {
        if (vehicles.length === 0) {
            return <InfoText>No vehicles match the current criteria.</InfoText>;
        }
      return viewMode === 'grid'
        ? <VehicleGrid vehicles={vehicles} />
        : <VehicleList vehicles={vehicles} />;
    }
    return null;
  };

  return (
    <>
      <Head>
        <title>Constellation Auction - Home</title>
        <meta name="description" content="Vehicle Auction Platform Listings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <StyledHeading>Available Vehicles</StyledHeading>

        <FilterSortControls />

        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />

        {renderVehicleView()}

        {vehiclesStatus === 'succeeded' && totalFilteredItems > pagination.limit && (
            <Pagination
                currentPage={pagination.page}
                totalItems={totalFilteredItems}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
            />
        )}

        <InfoText style={{ marginTop: '2rem' }}>
          (Check localStorage for persisted state keys)
        </InfoText>
      </Container>
    </>
  );
}

const Home = withAuth(HomePageContent);

export default Home;
