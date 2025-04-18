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
            middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
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
        mockedFetchVehiclesService.mockResolvedValue(mockResponse);

        await (store.dispatch as AppDispatch)(fetchVehicles());
        const state = store.getState().vehicles;

        expect(state.status).toBe('succeeded');
        expect(state.error).toBeNull();
        // Check if IDs were added correctly (ignoring other fields for simplicity)
        expect(state.allVehicles.map(v => v.id)).toEqual(['vehicle-0', 'vehicle-1']);
        expect(state.allVehicles.map(v => v.make)).toEqual(['Toyota', 'Honda']);
        expect(mockedFetchVehiclesService).toHaveBeenCalledTimes(1);
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