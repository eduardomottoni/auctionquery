import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from '@/store';
import { addFavorite, removeFavorite, selectFavorites } from '@/store/vehiclesSlice';
import { Vehicle } from '@/types/vehicle';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.border};
`;

const CardContent = styled.div`
  flex-grow: 1;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
`;

const CardDetail = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardPrice = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const CardActions = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between; // Align items
  align-items: center;
`;

const AuctionTime = styled.span`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.secondary};
    font-style: italic;
`;


const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  // Use Redux state for favorite status, ignore vehicle.favourite from data source
  const isFavorite = favorites.includes(vehicle.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(vehicle.id));
    } else {
      dispatch(addFavorite(vehicle.id));
    }
  };

  // Use the specific placeholder image path
  const imageUrl = `/images/placeholder.jpg`;

  return (
    <StyledCard>
      <CardImage src={imageUrl} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
      <CardContent>
        <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
        {/* Access nested properties */}
        <CardDetail>Type: {vehicle.details.specification.vehicleType}</CardDetail>
        <CardDetail>Colour: {vehicle.details.specification.colour}</CardDetail>
        <CardDetail>Mileage: {vehicle.mileage?.toLocaleString() || 'N/A'} miles</CardDetail>
        <CardDetail>Fuel: {vehicle.details.specification.fuel}</CardDetail>
        <CardDetail>Transmission: {vehicle.details.specification.transmission}</CardDetail>
        {/* Display startingBid as price */}
        <CardPrice>Starting Bid: ${vehicle.startingBid?.toLocaleString() || 'N/A'}</CardPrice>
      </CardContent>
      <CardActions>
        <AuctionTime>
          Auction: {new Date(vehicle.auctionDateTime).toLocaleString() || 'N/A'}
        </AuctionTime>
        <Button
          variant={isFavorite ? 'secondary' : 'outline'}
          size="sm"
          onClick={handleToggleFavorite}
        >
          {isFavorite ? 'Unfavorite' : 'Favorite'} ⭐
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default VehicleCard; 