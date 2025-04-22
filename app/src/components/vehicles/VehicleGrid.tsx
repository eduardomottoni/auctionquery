import React from 'react';
import styled from 'styled-components';
import { Vehicle } from '@/types/vehicle';
import VehicleCard from './VehicleCard';
import { media } from '@/styles/theme';

interface VehicleGridProps {
  vehicles: Vehicle[];
}

const GridContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  // Responsive grid columns
  grid-template-columns: repeat(1, 1fr); // 1 column by default (mobile)

  ${media.up('sm')} {
    grid-template-columns: repeat(2, 1fr); // 2 columns for small tablets+
  }

  ${media.up('md')} {
    grid-template-columns: repeat(3, 1fr); // 3 columns for tablets+
  }

  ${media.up('lg')} {
    grid-template-columns: repeat(4, 1fr); // 4 columns for laptops/desktops+
  }
`;

const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles }) => {
  if (!vehicles || vehicles.length === 0) {
    return <p>No vehicles found.</p>;
  }

  return (
    <GridContainer data-testid="vehicle-grid">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} data-testid="vehicle-card" />
      ))}
    </GridContainer>
  );
};

export default VehicleGrid; 