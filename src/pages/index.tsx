import { setFilters, setSort, setPagination, setLastSearch, setPage } from '@/store/searchSlice';
import { selectPaginatedVehicles, selectFilteredVehiclesCount } from '@/store/vehiclesSlice';
import Pagination from '@/components/ui/Pagination';
import ViewToggle from '@/components/vehicles/ViewToggle';
import styled from 'styled-components';

const ControlsBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
`;

const ItemsPerPageSelector = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};

    label {
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        white-space: nowrap;
    }

    select {
        padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        border: 1px solid ${({ theme }) => theme.colors.border};
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
    }
`;

const HomePageContent: React.FC = () => {
    const dispatch = useAppDispatch();
    const vehicles = useSelector(selectPaginatedVehicles);
    const totalFilteredItems = useSelector(selectFilteredVehiclesCount);
    const vehiclesStatus = useSelector((state: RootState) => state.vehicles.status);
    const vehiclesError = useSelector((state: RootState) => state.vehicles.error);
    const { page, limit } = useSelector((state: RootState) => state.search.pagination);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        if (vehiclesStatus === 'idle') {
            dispatch(fetchVehicles());
        }
    }, [vehiclesStatus, dispatch]);

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
        // Optional: could also dispatch setLastSearch here if desired
        // dispatch(setLastSearch());
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        dispatch(setPagination({ page: 1, limit: newLimit })); // Go to page 1 and set new limit
        dispatch(setLastSearch()); // Persist the change
    };

    let content;
    if (vehiclesStatus === 'loading') {
        content = <p>Loading vehicles...</p>;
    } else if (vehiclesStatus === 'succeeded') {
        content = (
            <>
                <ControlsBar>
                    <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
                    <ItemsPerPageSelector>
                        <label htmlFor="itemsPerPage">Items per page:</label>
                        <select id="itemsPerPage" value={limit} onChange={handleItemsPerPageChange}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </ItemsPerPageSelector>
                </ControlsBar>
                {viewMode === 'grid' ? (
                    <VehicleGrid vehicles={vehicles} />
                ) : (
                    <VehicleList vehicles={vehicles} />
                )}
                {totalFilteredItems > limit && (
                    <Pagination
                        currentPage={page}
                        totalItems={totalFilteredItems}
                        itemsPerPage={limit}
                        onPageChange={handlePageChange}
                    />
                )}
            </>
        );
    } else if (vehiclesStatus === 'failed') {
        content = <p>Error loading vehicles: {vehiclesError}</p>;
    }

    return (
        <div>
            <h1>Available Vehicles</h1>
            <FilterSortControls />
            {content}
        </div>
    );
};

export default HomePageContent; 