import React from 'react';
import styled from 'styled-components';
import { Vehicle } from '@/types/vehicle';
import VehicleListItem from './VehicleListItem'; // Import the new list item component

interface VehicleListProps {
  vehicles: Vehicle[];
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

// Optional: If we wanted a different card style for list view, we could create VehicleListItem
// and use that instead of VehicleCard here.

const VehicleList: React.FC<VehicleListProps> = ({ vehicles }) => {
  if (!vehicles || vehicles.length === 0) {
    return <p>No vehicles found.</p>;
  }

  return (
    <ListContainer>
      {vehicles.map((vehicle) => (
        <VehicleListItem key={vehicle.id} vehicle={vehicle} />
      ))}
    </ListContainer>
  );
};

export default VehicleList; 