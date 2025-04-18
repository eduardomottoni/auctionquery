// TODO: Define a proper Vehicle type later, perhaps in @/types
interface Vehicle {
  id: number | string;
  [key: string]: any; // Placeholder for other vehicle properties
}

// Base URL for fetching public data
const BASE_URL = '/data'; // Assuming Next.js serves public dir at root

/**
 * Fetches the vehicle dataset from the public directory.
 */
export const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await fetch(`${BASE_URL}/vehicles_dataset.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Vehicle[] = await response.json();
    // Basic validation (optional but good practice)
    if (!Array.isArray(data)) {
        throw new Error('Fetched data is not an array');
    }
    return data;
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    throw new Error('Failed to fetch vehicle data.'); // Re-throw a user-friendly error
  }
};

// --- Filtering, Sorting, Pagination Logic (Placeholder) ---
// These could be added here if we wanted the service to return processed data.
// However, we'll handle this with Redux selectors for better state management.

// export const filterVehicles = (vehicles: Vehicle[], filters: any): Vehicle[] => { ... };
// export const sortVehicles = (vehicles: Vehicle[], sort: any): Vehicle[] => { ... };
// export const paginateVehicles = (vehicles: Vehicle[], page: number, limit: number): Vehicle[] => { ... }; 