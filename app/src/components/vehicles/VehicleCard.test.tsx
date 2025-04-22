import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VehicleCard from './VehicleCard';
import { Vehicle } from '@/types/vehicle';
// Import necessary providers for testing
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import vehiclesReducer from '@/store/vehiclesSlice'; // Import reducer
import { lightTheme as theme } from '@/styles/theme'; // Use a specific theme

// Mock Vehicle Data (adjust based on your actual Vehicle type)
const mockVehicle: Vehicle = {
    id: 'test-123',
    make: 'TestMake',
    model: 'TestModel',
    year: 2024,
    mileage: 15000,
    engineSize: '2.0L',
    fuel: 'Petrol',
    auctionDateTime: new Date().toISOString(),
    startingBid: 20000,
    favourite: false,
    details: {
        specification: {
            vehicleType: 'Sedan',
            colour: 'Blue',
            fuel: 'Petrol',
            transmission: 'Automatic',
            numberOfDoors: 4,
            co2Emissions: '120g/km',
            noxEmissions: 0.05,
            numberOfKeys: 2,
        },
        ownership: {
            logBook: 'Yes',
            numberOfOwners: 1,
            dateOfRegistration: new Date().toISOString(),
        },
        equipment: ['GPS', 'Sunroof'],
    },
};

// Helper function to render with providers
const renderWithProviders = (ui: React.ReactElement, { preloadedState = {}, store = configureStore({ reducer: { vehicles: vehiclesReducer }, preloadedState }) } = {}) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </Provider>
  );
}

describe('<VehicleCard />', () => {
  it('renders vehicle information correctly', () => {
    renderWithProviders(<VehicleCard vehicle={mockVehicle} />);

    // Check if key information is displayed
    expect(screen.getByText(/2024 TestMake TestModel/i)).toBeInTheDocument();
    expect(screen.getByText(/Type: Sedan/i)).toBeInTheDocument();
    expect(screen.getByText(/Colour: Blue/i)).toBeInTheDocument();
    expect(screen.getByText(/Mileage: 15[,.]000 miles/i)).toBeInTheDocument();
    expect(screen.getByText(/Starting Bid: [\$\£]?20[,.]000/i)).toBeInTheDocument();
    // Remover este teste que busca por "Auction:" que não existe mais
    // expect(screen.getByText(/Auction:/i)).toBeInTheDocument();
    
    // Verificar o status da auction
    expect(screen.getByText(/Already Open|Opening Soon|\d+d \d+h until start/i)).toBeInTheDocument();
  });

  it('opens the details modal on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<VehicleCard vehicle={mockVehicle} />);

    // Check modal is initially closed (might need a more specific check)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click the card
    await user.click(screen.getByText(/2024 TestMake TestModel/i)); // Click on title or a reliable element

    // Check if modal is now open (assuming it has a dialog role)
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    // Check for modal title
    expect(screen.getByText(/TestMake TestModel Details/i)).toBeInTheDocument();
  });

  it('toggles favorite status without opening modal', async () => {
    const user = userEvent.setup();
    // Create a store where this vehicle is not initially favorited
    const store = configureStore({ reducer: { vehicles: vehiclesReducer } });
    renderWithProviders(<VehicleCard vehicle={mockVehicle} />, { store });

    // Find the favorite button (might need a better selector, e.g., test-id or aria-label)
    const favoriteButton = screen.getByRole('button', { name: /Favorite/i });
    expect(favoriteButton).toBeInTheDocument();

    // Modal should not be open initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click the favorite button
    await user.click(favoriteButton);

    // Check if the Redux state updated (favorite added)
    expect(store.getState().vehicles.favorites).toContain(mockVehicle.id);
    // Ensure button text/icon changes (if applicable)
    expect(screen.getByRole('button', { name: /Unfavorite/i })).toBeInTheDocument();
    // Modal should still NOT be open
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click again to unfavorite
    await user.click(screen.getByRole('button', { name: /Unfavorite/i }));
    expect(store.getState().vehicles.favorites).not.toContain(mockVehicle.id);
    expect(screen.getByRole('button', { name: /Favorite/i })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // Add more tests for different vehicle states, props etc.
}); 