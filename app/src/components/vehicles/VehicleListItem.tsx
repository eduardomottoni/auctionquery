import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from '@/store';
import { addFavorite, removeFavorite, selectFavorites } from '@/store/vehiclesSlice';
import { Vehicle } from '@/types/vehicle';
import Button from '@/components/ui/Button';
import { media } from '@/styles/theme';
import { RootState } from '@/store';
import { format } from 'date-fns';
import Modal from '@/components/ui/Modal';
import VehicleDetails from './VehicleDetails';

interface VehicleListItemProps {
  vehicle: Vehicle;
  style?: React.CSSProperties;
}

const ListItemWrapper = styled.div<{ style?: React.CSSProperties }>`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.2s ease-in-out;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  cursor: pointer;

  ${({ style }) => style && `
    position: ${style.position};
    top: ${style.top};
    left: ${style.left};
    width: ${style.width};
    height: ${style.height};
  `}

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    background-color: ${({ theme }) => theme.colors.border};
  }

  ${media.down('sm')} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  ${media.down('sm')} {
    width: 100%;
    height: 180px;
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
  flex-grow: 1;
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto;
  padding-left: ${({ theme }) => theme.spacing.md};

  ${media.down('sm')} {
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

const VehicleListItem: React.FC<VehicleListItemProps> = ({ vehicle, style }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => selectFavorites(state));
  const isFavorite = favorites.includes(vehicle.id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(vehicle.id));
    } else {
      dispatch(addFavorite(vehicle.id));
    }
  };

  const handleItemClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ListItemWrapper style={style} onClick={handleItemClick}>
        <ImageContainer>
          <ListItemImage src={'/images/placeholder.jpg'} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
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
            {isFavorite ? 'Unfav' : 'Fav'} ⭐
          </Button>
        </ActionsContainer>
      </ListItemWrapper>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`${vehicle.make} ${vehicle.model} Details`}>
        <VehicleDetails vehicle={vehicle} onClose={closeModal} />
      </Modal>
    </>
  );
};

export default VehicleListItem; 