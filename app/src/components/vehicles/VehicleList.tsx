import React from 'react';
import styled from 'styled-components';
import { Vehicle } from '@/types/vehicle';
import VehicleListItem from './VehicleListItem'; // Import the new list item component
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VehicleListProps {
  vehicles: Vehicle[];
}

const ListContainer = styled.div`
  height: 70vh; /* Or any desired height */
  width: 100%;
  min-height: 400px; /* Ensure minimum height */
`;

// Optional: If we wanted a different card style for list view, we could create VehicleListItem
// and use that instead of VehicleCard here.

// Estimate the height of a single VehicleListItem
const ROW_HEIGHT = 160; // Adjust this based on VehicleListItem's actual rendered height

const VehicleList: React.FC<VehicleListProps> = ({ vehicles }) => {
  if (!vehicles || vehicles.length === 0) {
    return <p>No vehicles found matching your criteria.</p>;
  }

  // Row component for FixedSizeList
  const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: Vehicle[] }) => {
    const vehicle = data[index];
    // Apply padding within the style if needed for spacing between items
    const rowStyle = {
      ...style,
      // Example: add padding-bottom for spacing
      // paddingBottom: '10px',
      // boxSizing: 'border-box',
    };
    return <VehicleListItem vehicle={vehicle} style={rowStyle} />;
  };

  return (
    <ListContainer>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={vehicles.length}
            itemSize={ROW_HEIGHT} // Use the estimated row height
            itemData={vehicles} // Pass vehicles array to the Row component
            overscanCount={5} // Adjust for smoother scrolling
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </ListContainer>
  );
};

export default VehicleList; 