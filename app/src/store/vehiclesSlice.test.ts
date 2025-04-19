import vehiclesReducer, {
    addFavorite,
    removeFavorite,
    setInitialFavorites,
    fetchVehicles,
    // Add other actions if needed
  } from './vehiclesSlice';
  // Import the type for mocking
  import { fetchVehicles as fetchVehiclesService } from '@/services/vehicleService';
  import { configureStore, ThunkAction } from '@reduxjs/toolkit';
  import { thunk } from 'redux-thunk';
  import { Vehicle } from '@/types/vehicle';
  import { VehiclesState } from './vehiclesSlice'; // Import the state type
  import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
  import type { RootState } from './index'; // Assuming your root state definition is in store/index.ts
  import { unwrapResult } from '@reduxjs/toolkit'; // Import unwrapResult

  // Mock the vehicle service
  jest.mock('@/services/vehicleService');
  const mockedFetchVehiclesService = fetchVehiclesService as jest.MockedFunction<typeof fetchVehiclesService>;

  describe('vehicles slice', () => {
    // Explicitly type the initial state
    const initialState: VehiclesState = {
      allVehicles: [],
      favorites: [],
      status: 'idle',
      error: null,
    };

    // Mock vehicle data
    const mockVehicle1: Partial<Vehicle> = { id: '1', make: 'Toyota' };
    const mockVehicle2: Partial<Vehicle> = { id: '2', make: 'Honda' };

    it('should handle initial state', () => {
      expect(vehiclesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addFavorite', () => {
      let state = vehiclesReducer(initialState, addFavorite('1'));
      expect(state.favorites).toEqual(['1']);
      // Should not add duplicates
      state = vehiclesReducer(state, addFavorite('1'));
      expect(state.favorites).toEqual(['1']);
    });

    it('should handle removeFavorite', () => {
      const stateWithFavorite = { ...initialState, favorites: ['1', '2'] };
      let state = vehiclesReducer(stateWithFavorite, removeFavorite('1'));
      expect(state.favorites).toEqual(['2']);
      // Should not fail if ID not present
      state = vehiclesReducer(state, removeFavorite('3'));
      expect(state.favorites).toEqual(['2']);
    });

    it('should handle setInitialFavorites', () => {
      const state = vehiclesReducer(initialState, setInitialFavorites(['3', '4']));
      expect(state.favorites).toEqual(['3', '4']);
    });

    // --- Testing fetchVehicles Thunk ---
    // Explicitly type the store
    let store: ReturnType<typeof configureStore<{ vehicles: VehiclesState }>>;
    // Define the expected dispatch type including thunks
    type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

    beforeEach(() => {
        // Create a new store for each test, explicitly adding thunk middleware
        store = configureStore({
            reducer: { vehicles: vehiclesReducer },
            middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
        });
        // Reset mocks before each test
        mockedFetchVehiclesService.mockClear();
    });

    it('should handle fetchVehicles pending', () => {
        // Dispatch might need casting if TS still struggles
        (store.dispatch as AppDispatch)(fetchVehicles());
        const state = store.getState().vehicles;
        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
    });

    it('should handle fetchVehicles fulfilled', async () => {
        const mockResponse = [mockVehicle1, mockVehicle2] as Vehicle[];
        // Directly test the mock
        mockedFetchVehiclesService.mockResolvedValue(mockResponse);
        const directResult = await mockedFetchVehiclesService(); // Call the mocked function directly
        console.log('Direct mock result:', directResult); // Keep logging for now
        expect(directResult).toEqual(mockResponse);

        // Use unwrapResult to ensure thunk promise is fully settled
        const action = await store.dispatch(fetchVehicles());
        try {
            const result = unwrapResult(action);
            console.log('Unwrapped thunk result:', result); // Log the actual result seen by reducer
            // Optionally assert on the result if needed, though we mainly care about state
        } catch (error) {
            console.error('Thunk failed unexpectedly in test:', error);
            // Fail the test if the thunk rejected when it shouldn't have
            throw error;
        }

        const state = store.getState().vehicles;
        console.log('State after dispatch and unwrap:', state); // Updated logging

        expect(state.status).toBe('succeeded');
        expect(state.error).toBeNull();
        // Check if IDs were added correctly using the IDs from the mock data
        expect(state.allVehicles.map(v => v.id)).toEqual(['1', '2']); // Corrected expectation
        expect(state.allVehicles.map(v => v.make)).toEqual(['Toyota', 'Honda']);
        // The mock was called directly once, and once by the thunk
        expect(mockedFetchVehiclesService).toHaveBeenCalledTimes(2);
    });

    it('should handle fetchVehicles rejected', async () => {
        const errorMessage = 'Failed to fetch';
        mockedFetchVehiclesService.mockRejectedValue(new Error(errorMessage));

        await (store.dispatch as AppDispatch)(fetchVehicles());
        const state = store.getState().vehicles;

        expect(state.status).toBe('failed');
        expect(state.error).toBe(errorMessage);
        expect(state.allVehicles).toEqual([]);
        expect(mockedFetchVehiclesService).toHaveBeenCalledTimes(1);
    });

    // Add tests for other reducers (setVehiclesLoading, etc.) if needed
  }); 