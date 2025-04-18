import { setFilters, setSort, setPagination } from '@/store/searchSlice';

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();

  // Load persisted state on initial client-side render
  useEffect(() => {
    const persistedState = loadPersistedState();
    if (persistedState) {
      if (persistedState.vehicles && persistedState.vehicles.favorites) {
        dispatch(setInitialFavorites(persistedState.vehicles.favorites));
      }
      if (persistedState.search && persistedState.search.lastSearch) {
        // Dispatch action to store the loaded lastSearch (optional, depends on slice logic)
        dispatch(setInitialLastSearch(persistedState.search.lastSearch));

        // *** Restore active search state from lastSearch ***
        const { filters, sort, pagination } = persistedState.search.lastSearch;
        if (filters) {
            dispatch(setFilters(filters));
        }
        if (sort) {
            dispatch(setSort(sort));
        }
        if (pagination) {
            dispatch(setPagination(pagination)); // <-- Restore pagination
        }
      }
      if (persistedState.auth) {
          dispatch(setInitialAuthState(persistedState.auth));
      }
    }
  }, [dispatch]);

  // ... rest of component ...
} 