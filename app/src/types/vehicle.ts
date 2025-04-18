// Updated based on user provided structure

export interface Specification {
    vehicleType: string;
    colour: string;
    fuel: string;
    transmission: string;
    numberOfDoors: number;
    co2Emissions: string;
    noxEmissions: number;
    numberOfKeys: number;
}

export interface Ownership {
    logBook: string;
    numberOfOwners: number;
    dateOfRegistration: string;
}

export interface Details {
    specification: Specification;
    ownership: Ownership;
    equipment: string[];
}

// Renamed from Root for consistency, added mandatory id
export interface Vehicle {
    id: number | string; // Added: Crucial for keys and favorites
    make: string;
    model: string;
    engineSize: string;
    fuel: string; // Note: Also present in Specification
    year: number;
    mileage: number;
    auctionDateTime: string;
    startingBid: number;
    favourite: boolean; // Note: This might conflict with Redux state if source has it
    details: Details;
} 