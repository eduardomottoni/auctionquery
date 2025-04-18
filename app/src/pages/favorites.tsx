import Head from 'next/head';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '@/store';
import {
  // Import the new favorite selectors
  selectPaginatedFavoriteVehicles,
  selectFilteredFavoriteVehiclesCount,
  selectFavoriteVehicles, // Need this for the initial empty check
  selectVehiclesStatus, // Import status selector
  fetchVehicles, // Import fetch action
} from '@/store/vehiclesSlice';
import { setPage, setLimit } from '@/store/searchSlice';
import { RootState } from '@/store';
import VehicleGrid from '@/components/vehicles/VehicleGrid';
import VehicleList from '@/components/vehicles/VehicleList';
import ViewToggle, { ViewMode } from '@/components/vehicles/ViewToggle';
import FilterSortControls from '@/components/search/FilterSortControls';
import Pagination from '@/components/Pagination'; // Correct path
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

function FavoritesPageContent() {
  const dispatch = useDispatch();
  // Selectors for favorites page
  const allFavoriteVehicles = useSelector(selectFavoriteVehicles);
  const paginatedVehicles = useSelector(selectPaginatedFavoriteVehicles);
  const totalFilteredItems = useSelector(selectFilteredFavoriteVehiclesCount);
  const pagination = useSelector((state: RootState) => state.search.pagination);
  const vehiclesStatus = useSelector(selectVehiclesStatus);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Fetch vehicles if they haven't been loaded yet
  useEffect(() => {
    if (vehiclesStatus === 'idle') {
      dispatch(fetchVehicles());
    }
  }, [dispatch, vehiclesStatus]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const renderVehicleView = () => {
    // Initial Empty State Check
    if (allFavoriteVehicles.length === 0) {
        return <InfoText>You haven't added any vehicles to your favorites yet.</InfoText>;
    }
    // Filtered Empty State Check
    if (paginatedVehicles.length === 0) {
        return <InfoText>No favorite vehicles match the current criteria.</InfoText>;
    }

    // Display vehicles
    return viewMode === 'grid'
        ? <VehicleGrid vehicles={paginatedVehicles} />
        : <VehicleList vehicles={paginatedVehicles} />;
  };

  return (
    <>
      <Head>
        <title>Constellation Auction - Favorites</title>
        <meta name="description" content="Your favorited vehicles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <StyledHeading>My Favorite Vehicles</StyledHeading>

        {/* Only show controls if there are favorites */}
        {allFavoriteVehicles.length > 0 && (
          <>
            <FilterSortControls />
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          </>
        )}

        {renderVehicleView()}

        {/* Only show pagination if there are items matching filters and pagination is needed */}
        {totalFilteredItems > 0 && totalFilteredItems > pagination.limit && (
            <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(totalFilteredItems / pagination.limit)}
                totalItems={totalFilteredItems}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
            />
        )}
      </Container>
    </>
  );
}

const FavoritesPage = withAuth(FavoritesPageContent);

export default FavoritesPage; 