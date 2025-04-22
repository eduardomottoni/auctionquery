import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from '@/store';
import { addFavorite, removeFavorite, selectFavorites } from '@/store/vehiclesSlice';
import { Vehicle } from '@/types/vehicle';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import VehicleDetails from './VehicleDetails';
import { format, differenceInDays, differenceInHours, isPast } from 'date-fns';

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
    font-style: italic;
    display: flex;
    align-items: center;
`;

const TrafficLight = styled.div`
    display: inline-block;
    margin-right: ${({ theme }) => theme.spacing.xs};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => props.color};
`;

interface CountdownTextProps {
    color: string;
    bold?: boolean;
}

const CountdownText = styled.span<CountdownTextProps>`
    color: ${(props) => props.color};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${(props) => props.bold ? 'bold' : 'normal'};
`;

const formatDateShort = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PPp'); // e.g., Jun 20, 2023, 4:30 PM
  } catch {
    return 'Invalid Date';
  }
};

const getAuctionStatus = (auctionDateTime: string | undefined) => {
  if (!auctionDateTime) return { days: 0, hours: 0, isStarted: false, isCloseToStart: false };
  
  try {
    const auctionDate = new Date(auctionDateTime);
    const now = new Date();
    
    if (isPast(auctionDate)) {
      return { days: 0, hours: 0, isStarted: true, isCloseToStart: false };
    }
    
    const days = differenceInDays(auctionDate, now);
    const hours = differenceInHours(auctionDate, now) % 24;
    const isCloseToStart = days < 7;
    
    return { days, hours, isStarted: false, isCloseToStart };
  } catch {
    return { days: 0, hours: 0, isStarted: false, isCloseToStart: false };
  }
};

const VehicleCard: React.FC<VehicleCardProps> = React.memo(({ vehicle }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  // Use Redux state for favorite status, ignore vehicle.favourite from data source
  const isFavorite = favorites.includes(vehicle.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auctionStatus, setAuctionStatus] = useState(getAuctionStatus(vehicle.auctionDateTime));

  useEffect(() => {
    // Update the countdown every hour
    const interval = setInterval(() => {
      setAuctionStatus(getAuctionStatus(vehicle.auctionDateTime));
    }, 3600000); // 1 hour in milliseconds
    
    return () => clearInterval(interval);
  }, [vehicle.auctionDateTime]);

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(vehicle.id));
    } else {
      dispatch(addFavorite(vehicle.id));
    }
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Use the specific placeholder image path
  const imageUrl = `/images/placeholder.jpg`;

  // Determine traffic light color and message based on auction status
  let trafficLightColor = '#FF0000'; // Red by default (3+ days)
  let countdownColor = '#FF0000';
  let countdownMessage = '';
  
  if (auctionStatus.isStarted) {
    trafficLightColor = '#00FF00'; // Green
    countdownColor = '#00FF00';
    countdownMessage = 'Already Open';
  } else if (auctionStatus.isCloseToStart) {
    trafficLightColor = '#FFA500'; // Amber/orange instead of yellow for better visibility
    countdownColor = '#FFA500';
    countdownMessage = `${auctionStatus.days}d ${auctionStatus.hours}h - Opening Soon!`;
  } else {
    countdownMessage = `${auctionStatus.days}d ${auctionStatus.hours}h until start`;
  }

  return (
    <>
      <StyledCard onClick={handleCardClick}>
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
            <TrafficLight color={trafficLightColor} />
            <CountdownText color={countdownColor} bold={auctionStatus.isStarted || auctionStatus.isCloseToStart}>
              {countdownMessage}
            </CountdownText>
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`${vehicle.make} ${vehicle.model} Details`}>
        <VehicleDetails vehicle={vehicle} onClose={closeModal} />
      </Modal>
    </>
  );
});

export default VehicleCard; 