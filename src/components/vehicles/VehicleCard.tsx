import React from 'react';
import styled from 'styled-components';
import { Vehicle } from '@/types/vehicle';
import Button from '@/components/ui/Button';
import { Card as UICard } from '@/components/ui/Card'; // Alias to avoid naming conflict
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, selectFavorites } from '@/store/vehiclesSlice';
import { RootState, useAppDispatch } from '@/store';

// Accept an optional style prop from react-window
interface VehicleCardProps {
  vehicle: Vehicle;
  style?: React.CSSProperties; // Optional style prop for positioning/sizing by virtualizer
}

// Use the imported UI Card and apply the style prop
const StyledCard = styled(UICard)<{ style?: React.CSSProperties }>`
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure card takes full height from virtualizer cell */
  /* Remove external margins if they exist, as spacing is handled by the grid/list */
  margin: 0;
  overflow: hidden; // Prevent content overflow issues

  /* Apply the style prop from react-window */
  ${({ style }) => style && `
    position: ${style.position};
    top: ${style.top};
    left: ${style.left};
    width: ${style.width};
    height: ${style.height};
    // Add any other properties passed by react-window if needed
  `}
`;

// Keep internal styled components as they were
const ImageContainer = styled.div`
  width: 100%;
  height: 150px; // Or use aspect-ratio
  overflow: hidden;
  flex-shrink: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  flex-grow: 1; // Allow content to grow
  min-height: 0; // Prevent flexbox overflow issues
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Detail = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.div`
  margin-top: auto; // Push price and button to the bottom
  padding-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto; // Pushes footer to bottom
    padding-top: ${({ theme }) => theme.spacing.sm}; // Add space above footer
`;

const AuctionTime = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.secondary};
    white-space: nowrap;
`;

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, style }) => {
    const dispatch = useAppDispatch();
    const favorites = useSelector((state: RootState) => selectFavorites(state));
    const isFavorite = favorites.includes(vehicle.id);

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click if needed
        if (isFavorite) {
            dispatch(removeFavorite(vehicle.id));
        } else {
            dispatch(addFavorite(vehicle.id));
        }
    };

    const auctionDate = vehicle.auctionDateTime ? new Date(vehicle.auctionDateTime).toLocaleDateString() : 'N/A';

    return (
        // Pass the style prop to the styled Card component
        <StyledCard style={style}>
            <ImageContainer>
                <img src={vehicle.details.specification.imageUrl || '/images/placeholder.jpg'} alt={`${vehicle.make} ${vehicle.model}`} />
            </ImageContainer>
            <Content>
                <Title>{vehicle.year} {vehicle.make} {vehicle.model}</Title>
                <Detail>Color: {vehicle.details.specification.colour || 'N/A'}</Detail>
                <Detail>Mileage: {vehicle.mileage != null ? `${vehicle.mileage.toLocaleString()} miles` : 'N/A'}</Detail>
                {/* Add more details if needed */}
                <CardFooter>
                    <div>
                        <Price>${vehicle.startingBid != null ? vehicle.startingBid.toLocaleString() : 'N/A'}</Price>
                        <AuctionTime>Auction: {auctionDate}</AuctionTime>
                    </div>
                    <Button
                        variant={isFavorite ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={handleToggleFavorite}
                    >
                        {isFavorite ? 'Unfav' : 'Fav'} {/* Shorten text */}
                    </Button>
                </CardFooter>
            </Content>
        </StyledCard>
    );
};

export default VehicleCard; 