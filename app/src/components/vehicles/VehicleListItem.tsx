import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from '@/store';
import { addFavorite, removeFavorite, selectFavorites } from '@/store/vehiclesSlice';
import { Vehicle } from '@/types/vehicle';
import Button from '@/components/ui/Button';
import { media } from '@/styles/theme';

interface VehicleListItemProps {
  vehicle: Vehicle;
}

const ListItemWrapper = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.2s ease-in-out;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start; // Align items to the top

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${media.down('sm')} { // Stack vertically on small screens
    flex-direction: column;
    align-items: stretch;
  }
`;

const ImageContainer = styled.div`
  flex-shrink: 0; // Prevent image from shrinking
  width: 120px; // Fixed width for list image
  height: 90px;  // Fixed height
  ${media.down('sm')} {
    width: 100%; // Full width on small screens
    height: 180px; // Taller image when stacked
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const ListItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.border};
`;

const ContentContainer = styled.div`
  flex-grow: 1; // Takes up remaining space
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); // Responsive columns for details
  gap: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DetailItem = styled.span`
  white-space: nowrap;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column; // Stack price/time and button vertically
  align-items: flex-end; // Align to the right
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto; // Push to the far right
  padding-left: ${({ theme }) => theme.spacing.md};

  ${media.down('sm')} { // Align differently on small screens
     margin-left: 0;
     margin-top: ${({ theme }) => theme.spacing.md};
     flex-direction: row;
     justify-content: space-between;
     width: 100%;
  }
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary};
  text-align: right;
`;

const AuctionTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary};
  font-style: italic;
  text-align: right;
`;

const VehicleListItem: React.FC<VehicleListItemProps> = ({ vehicle }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.includes(vehicle.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(vehicle.id));
    } else {
      dispatch(addFavorite(vehicle.id));
    }
  };

  const imageUrl = `/images/placeholder.jpg`;

  return (
    <ListItemWrapper>
      <ImageContainer>
        <ListItemImage src={imageUrl} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
      </ImageContainer>

      <ContentContainer>
        <Title>{vehicle.year} {vehicle.make} {vehicle.model}</Title>
        <DetailsGrid>
          <DetailItem>Type: {vehicle.details.specification.vehicleType}</DetailItem>
          <DetailItem>Colour: {vehicle.details.specification.colour}</DetailItem>
          <DetailItem>Mileage: {vehicle.mileage?.toLocaleString() || 'N/A'}</DetailItem>
          <DetailItem>Fuel: {vehicle.details.specification.fuel}</DetailItem>
          <DetailItem>Transmission: {vehicle.details.specification.transmission}</DetailItem>
          <DetailItem>Doors: {vehicle.details.specification.numberOfDoors}</DetailItem>
          <DetailItem>Owners: {vehicle.details.ownership.numberOfOwners}</DetailItem>
        </DetailsGrid>
      </ContentContainer>

      <ActionsContainer>
          <div>
            <Price>Bid: ${vehicle.startingBid?.toLocaleString() || 'N/A'}</Price>
            <AuctionTime>Auction: {new Date(vehicle.auctionDateTime).toLocaleString() || 'N/A'}</AuctionTime>
          </div>
          <Button
            variant={isFavorite ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleToggleFavorite}
          >
            {isFavorite ? 'Unfav' : 'Fav'} ⭐ {/* Shorter text */}
          </Button>
      </ActionsContainer>
    </ListItemWrapper>
  );
};

export default VehicleListItem; 