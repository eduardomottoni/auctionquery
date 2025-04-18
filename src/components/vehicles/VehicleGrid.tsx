import React, { useState, useEffect } from 'react';
import { Vehicle } from '@/types/vehicle';
import VehicleCard from './VehicleCard';
import styled from 'styled-components';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useTheme } from 'styled-components'; // Import useTheme to access breakpoints

interface VehicleGridProps {
  vehicles: Vehicle[];
}

const GridContainer = styled.div`
    /* Set a min-height or height to ensure AutoSizer works correctly */
    min-height: 600px; /* Adjust as needed, or make it flexible */
    height: 70vh; /* Example: 70% of viewport height */
    width: 100%;
`;

// --- Sizing Constants (adjust based on VehicleCard design) ---
const CARD_MIN_WIDTH = 280; // Minimum desired width for a card
const CARD_ASPECT_RATIO = 1.5; // Approximate aspect ratio (height / width)
const GRID_GAP = 16; // Corresponds to theme.spacing.md (ensure consistency)
// --- End Sizing Constants ---

const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles }) => {
    const theme = useTheme();

    if (!vehicles || vehicles.length === 0) {
        return <p>No vehicles found matching your criteria.</p>;
    }

    // Cell component for FixedSizeGrid
    const Cell = ({ columnIndex, rowIndex, style, data }: {
        columnIndex: number;
        rowIndex: number;
        style: React.CSSProperties;
        data: { vehicles: Vehicle[]; columnCount: number };
    }) => {
        const { vehicles, columnCount } = data;
        const index = rowIndex * columnCount + columnIndex;

        // Don't render anything for cells that are outside the actual item count
        if (index >= vehicles.length) {
            return null;
        }

        const vehicle = vehicles[index];

        // Apply gap using padding within the style provided by react-window
        const cellStyle = {
            ...style,
            paddingRight: GRID_GAP + 'px',
            paddingBottom: GRID_GAP + 'px',
            boxSizing: 'border-box' as const, // Include padding in width/height
        };

        return <VehicleCard vehicle={vehicle} style={cellStyle} />;
    };

    return (
        <GridContainer>
            <AutoSizer>
                {({ height, width }) => {
                    // Calculate ideal number of columns based on container width and desired card width
                    const availableWidth = width - GRID_GAP; // Account for initial gap on the right
                    const columnCount = Math.max(1, Math.floor(availableWidth / (CARD_MIN_WIDTH + GRID_GAP)));

                    // Calculate column width based on available space and number of columns
                    const columnWidth = Math.floor(availableWidth / columnCount);

                    // Calculate row height based on column width and aspect ratio
                    const rowHeight = Math.floor(columnWidth * CARD_ASPECT_RATIO);

                    // Calculate row count
                    const rowCount = Math.ceil(vehicles.length / columnCount);

                    return (
                        <FixedSizeGrid
                            height={height}
                            width={width}
                            columnCount={columnCount}
                            columnWidth={columnWidth}
                            rowCount={rowCount}
                            rowHeight={rowHeight}
                            itemData={{ vehicles, columnCount }} // Pass necessary data to Cell
                            // The overscan counts can be adjusted for smoother scrolling vs performance
                            overscanRowCount={2}
                            overscanColumnCount={1}
                            style={{ overflowX: 'hidden' }} // Prevent horizontal scrollbar if calculations are slightly off
                        >
                            {Cell}
                        </FixedSizeGrid>
                    );
                }}
            </AutoSizer>
        </GridContainer>
    );
};

export default VehicleGrid; 