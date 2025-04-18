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
import ItemsPerPageSelector from '@/components/ItemsPerPageSelector'; // Import the new component
import withAuth from '@/components/withAuth';
import { useMediaQuery } from '@/hooks/useMediaQuery'; // Import hook
import { media } from '@/styles/theme'; // Import media helper

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

// Add a wrapper for the controls above the list/grid (can reuse name)
const TopControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; // Allow wrapping on smaller screens
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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
  // Check if we are on a small screen
  const isSmallScreen = useMediaQuery(media.down('sm')); // Check based on the breakpoint used in ViewToggle

  // Force grid view on small screens if list was somehow selected
  useEffect(() => {
      if (isSmallScreen && viewMode === 'list') {
          setViewMode('grid');
      }
  }, [isSmallScreen, viewMode]);

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
    dispatch(setPage(1)); // Reset to page 1 when limit changes
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

    // Determine the effective view mode, forcing grid on small screens
    const effectiveViewMode = isSmallScreen ? 'grid' : viewMode;
    return effectiveViewMode === 'grid'
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
            {/* Use the new container for ViewToggle and ItemsPerPageSelector */}
            <TopControlsContainer>
              <ItemsPerPageSelector
                itemsPerPage={pagination.limit}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
              <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            </TopControlsContainer>
          </>
        )}

        {renderVehicleView()}

        {/* Only show pagination if there are items matching filters and pagination is needed */}
        {totalFilteredItems > 0 && totalFilteredItems > pagination.limit && (
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

const FavoritesPage = withAuth(FavoritesPageContent);

export default FavoritesPage; 