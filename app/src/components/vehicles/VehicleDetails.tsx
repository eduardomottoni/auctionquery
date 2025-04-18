import React from 'react';
import styled from 'styled-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Basic styling
import { useDispatch, useSelector } from '@/store';
import { addFavorite, removeFavorite, selectFavorites } from '@/store/vehiclesSlice';
import { Vehicle } from '@/types/vehicle';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { formatDate } from '@/utils/dateUtils';

// --- Styled Components for Details ---
const DetailsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  position: relative; // Needed for favorite button positioning
  padding-right: 50px; // Space for favorite button
`;

const VehicleHeader = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 1.8rem;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};

  &.is-favorite {
    color: #fdd835; // Yellow for favorite
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledTabs = styled(Tabs)`
  margin-top: ${({ theme }) => theme.spacing.lg};

  .react-tabs__tab-list {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    margin: 0 0 10px;
    padding: 0;
  }

  .react-tabs__tab {
    display: inline-block;
    border: 1px solid transparent;
    border-bottom: none;
    bottom: -1px;
    position: relative;
    list-style: none;
    padding: 6px 12px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};

    &.react-tabs__tab--selected {
      background: ${({ theme }) => theme.colors.background};
      border-color: ${({ theme }) => theme.colors.border};
      color: ${({ theme }) => theme.colors.primary};
      border-radius: 5px 5px 0 0;
      font-weight: bold;
    }

    &.react-tabs__tab--disabled {
      color: GrayText;
      cursor: default;
    }
  }

  .react-tabs__tab-panel {
    display: none;
    padding: ${({ theme }) => theme.spacing.md} 0;

    &.react-tabs__tab-panel--selected {
      display: block;
    }
  }
`;

const DetailSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DetailTitle = styled.h4`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: 1.1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 4px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`;

const DetailItem = styled.div`
  font-size: 0.95rem;
  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 2px;
    font-weight: 600;
  }
`;

const EquipmentList = styled.ul`
  list-style: disc;
  margin-left: ${({ theme }) => theme.spacing.lg};
  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

// Add Carousel Container
const CarouselContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 500px; // Limit carousel width
  margin-left: auto;
  margin-right: auto;

  .carousel .slide img {
    max-height: 400px; // Limit image height within carousel
    width: auto; // Maintain aspect ratio
    object-fit: contain;
  }
`;

// --- Component Props ---
interface VehicleDetailsProps {
  vehicle: Vehicle;
  onClose: () => void; // Passed down from Modal trigger
}

// --- Helper Functions ---
// formatDate is now imported

// --- Vehicle Details Component ---
const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle, onClose }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.includes(vehicle.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(vehicle.id));
    } else {
      dispatch(addFavorite(vehicle.id));
    }
  };

  const renderDetailItem = (label: string, value: string | number | undefined | null) => (
    value !== undefined && value !== null && value !== '' ? (
      <DetailItem>
        <strong>{label}:</strong> {value}
      </DetailItem>
    ) : null
  );

  return (
    <DetailsContainer>
      <VehicleHeader>{vehicle.make} {vehicle.model} ({vehicle.year})</VehicleHeader>
      <FavoriteButton
        onClick={handleFavoriteToggle}
        className={isFavorite ? 'is-favorite' : ''}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '★' : '☆'}
      </FavoriteButton>

      {/* Add Image Carousel */}
      <CarouselContainer>
        <Carousel showThumbs={false} infiniteLoop useKeyboardArrows dynamicHeight>
          <div>
            <img src="/images/placeholder.jpg" alt={`${vehicle.make} ${vehicle.model} view 1`} />
            {/* <p className="legend">Legend 1</p> */}
          </div>
          <div>
            <img src="/images/placeholder.jpg" alt={`${vehicle.make} ${vehicle.model} view 2`} />
          </div>
          <div>
            <img src="/images/placeholder.jpg" alt={`${vehicle.make} ${vehicle.model} view 3`} />
          </div>
        </Carousel>
      </CarouselContainer>

      <StyledTabs>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Specification</Tab>
          <Tab>Ownership</Tab>
          <Tab>Equipment</Tab>
          <Tab>Auction Info</Tab>
        </TabList>

        {/* Overview Tab */}
        <TabPanel>
          <DetailSection>
            <DetailTitle>Basic Information</DetailTitle>
            <DetailGrid>
              {renderDetailItem('Make', vehicle.make)}
              {renderDetailItem('Model', vehicle.model)}
              {renderDetailItem('Year', vehicle.year)}
              {renderDetailItem('Mileage', vehicle.mileage?.toLocaleString())}
              {renderDetailItem('Engine Size', vehicle.engineSize)}
              {renderDetailItem('Fuel Type', vehicle.fuel)}
            </DetailGrid>
          </DetailSection>
        </TabPanel>

        {/* Specification Tab */}
        <TabPanel>
          <DetailSection>
             <DetailTitle>Vehicle Specification</DetailTitle>
             <DetailGrid>
                {renderDetailItem('Type', vehicle.details.specification.vehicleType)}
                {renderDetailItem('Colour', vehicle.details.specification.colour)}
                {renderDetailItem('Transmission', vehicle.details.specification.transmission)}
                {renderDetailItem('Doors', vehicle.details.specification.numberOfDoors)}
                {renderDetailItem('CO2 Emissions', vehicle.details.specification.co2Emissions)}
                {renderDetailItem('NOx Emissions', vehicle.details.specification.noxEmissions)}
                {renderDetailItem('Keys', vehicle.details.specification.numberOfKeys)}
             </DetailGrid>
          </DetailSection>
        </TabPanel>

        {/* Ownership Tab */}
        <TabPanel>
          <DetailSection>
             <DetailTitle>Ownership History</DetailTitle>
             <DetailGrid>
                {renderDetailItem('Log Book', vehicle.details.ownership.logBook)}
                {renderDetailItem('Owners', vehicle.details.ownership.numberOfOwners)}
                {renderDetailItem('Registered', formatDate(vehicle.details.ownership.dateOfRegistration))}
             </DetailGrid>
          </DetailSection>
        </TabPanel>

        {/* Equipment Tab */}
        <TabPanel>
           <DetailSection>
                <DetailTitle>Equipment</DetailTitle>
                {vehicle.details.equipment && vehicle.details.equipment.length > 0 ? (
                    <EquipmentList>
                        {vehicle.details.equipment.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </EquipmentList>
                ) : (
                    <p>No equipment information available.</p>
                )}
           </DetailSection>
        </TabPanel>

        {/* Auction Info Tab */}
        <TabPanel>
           <DetailSection>
                <DetailTitle>Auction Details</DetailTitle>
                 <DetailGrid>
                    {renderDetailItem('Starting Bid', `£${vehicle.startingBid?.toLocaleString()}`)}
                    {renderDetailItem('Auction Date/Time', formatDate(vehicle.auctionDateTime))}
                 </DetailGrid>
           </DetailSection>
        </TabPanel>

      </StyledTabs>

    </DetailsContainer>
  );
};

export default VehicleDetails; 