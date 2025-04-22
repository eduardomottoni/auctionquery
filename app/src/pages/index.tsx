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
import { setPage, setLimit } from '@/store/searchSlice';
import { RootState } from '@/store';
import VehicleGrid from '@/components/vehicles/VehicleGrid';
import VehicleList from '@/components/vehicles/VehicleList';
import ViewToggle, { ViewMode } from '@/components/vehicles/ViewToggle';
import FilterSortControls from '@/components/search/FilterSortControls';
import Pagination from '@/components/Pagination';
import withAuth from '@/components/withAuth';
import ErrorBoundary from '@/components/ErrorBoundary';
import Button from '@/components/ui/Button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { media } from '@/styles/theme';
import ItemsPerPageSelector from '@/components/ItemsPerPageSelector';

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

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const TopControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

function HomePageContent() {
  const dispatch = useDispatch();
  const vehicles = useSelector(selectPaginatedVehicles);
  const vehiclesStatus = useSelector(selectVehiclesStatus);
  const pagination = useSelector((state: RootState) => state.search.pagination);
  const totalFilteredItems = useSelector(selectFilteredVehiclesCount);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const isSmallScreen = useMediaQuery(media.down('sm'));

  useEffect(() => {
    if (isSmallScreen && viewMode === 'list') {
      setViewMode('grid');
    }
  }, [isSmallScreen, viewMode]);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch, pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
    dispatch(setPage(1));
  };

  const handleRetryFetch = () => {
    dispatch(fetchVehicles());
  };

  const renderVehicleView = () => {
    if (vehiclesStatus === 'loading') {
      return <InfoText>Loading vehicles...</InfoText>;
    }
    if (vehiclesStatus === 'failed') {
      return (
        <ErrorContainer>
            <InfoText style={{ color: 'red' }}>Error loading vehicles.</InfoText>
            <Button onClick={handleRetryFetch} variant="primary" size="md">
                Retry
            </Button>
        </ErrorContainer>
      );
    }
    if (vehiclesStatus === 'succeeded') {
        if (vehicles.length === 0) {
            return <InfoText>No vehicles match the current criteria.</InfoText>;
        }
      const effectiveViewMode = isSmallScreen ? 'grid' : viewMode;
      return effectiveViewMode === 'grid'
        ? <VehicleGrid vehicles={vehicles} />
        : <VehicleList vehicles={vehicles} />;
    }
    return null;
  };

  return (
    <>
      <Head>
        <title>Vehicle Auction - Home</title>
        <meta name="description" content="Vehicle Auction Platform Listings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <StyledHeading>Available Vehicles</StyledHeading>

        <ErrorBoundary fallbackMessage="Could not load filter/sort controls.">
          <FilterSortControls />
        </ErrorBoundary>

        <TopControlsContainer>
          <ItemsPerPageSelector 
            itemsPerPage={pagination.limit}
            onItemsPerPageChange={handleItemsPerPageChange} 
          />
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </TopControlsContainer>

        <ErrorBoundary fallbackMessage="Could not display vehicles.">
          {renderVehicleView()}
        </ErrorBoundary>

        {vehiclesStatus === 'succeeded' && totalFilteredItems > 0 && (
            <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(totalFilteredItems / pagination.limit)}
                totalItems={totalFilteredItems}
                onPageChange={handlePageChange}
            />
        )}
      </Container>
    </>
  );
}

const Home = withAuth(HomePageContent);

export default Home;
