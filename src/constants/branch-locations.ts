// Sample branch locations for testing location-based authentication
// Based on current location: 23.983313°N, 91.106747°E (Brahmanbaria, Bangladesh)

export interface BranchLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isWithinRange: boolean; // within 100m
}

// Current user location for reference
export const CURRENT_LOCATION = {
  latitude: 23.983313,
  longitude: 91.106747,
  address: "X4M4+9J9, Brahmanbaria, Chittagong Division, Bangladesh",
};

// Maximum allowed distance for branch validation (in meters)
export const MAX_BRANCH_DISTANCE = 100;

// Sample branch locations for testing
export const SAMPLE_BRANCH_LOCATIONS: BranchLocation[] = [
  // Within 100m range (4 locations)
  {
    id: "branch_001",
    name: "Main Branch - Brahmanbaria",
    address: "X4M4+8J8, Brahmanbaria Central, Bangladesh",
    latitude: 23.98325,
    longitude: 91.1067,
    isWithinRange: true, // ~8m away
  },
  {
    id: "branch_002",
    name: "City Center Branch",
    address: "X4M4+9K9, Brahmanbaria Market, Bangladesh",
    latitude: 23.98338,
    longitude: 91.1068,
    isWithinRange: true, // ~9m away
  },
  {
    id: "branch_003",
    name: "Commercial Branch",
    address: "X4M4+8H8, Brahmanbaria Commercial Area, Bangladesh",
    latitude: 23.9832,
    longitude: 91.1066,
    isWithinRange: true, // ~17m away
  },
  {
    id: "branch_004",
    name: "Downtown Branch",
    address: "X4M4+9L9, Brahmanbaria Downtown, Bangladesh",
    latitude: 23.98345,
    longitude: 91.1069,
    isWithinRange: true, // ~20m away
  },

  // Beyond 100m range (6 locations)
  {
    id: "branch_005",
    name: "North Branch",
    address: "X4M5+2J2, North Brahmanbaria, Bangladesh",
    latitude: 23.9845,
    longitude: 91.106747,
    isWithinRange: false, // ~132m away
  },
  {
    id: "branch_006",
    name: "South Branch",
    address: "X4M3+8J8, South Brahmanbaria, Bangladesh",
    latitude: 23.9821,
    longitude: 91.106747,
    isWithinRange: false, // ~135m away
  },
  {
    id: "branch_007",
    name: "East Branch",
    address: "X4M4+9P9, East Brahmanbaria, Bangladesh",
    latitude: 23.983313,
    longitude: 91.108,
    isWithinRange: false, // ~140m away
  },
  {
    id: "branch_008",
    name: "West Branch",
    address: "X4M4+9F9, West Brahmanbaria, Bangladesh",
    latitude: 23.983313,
    longitude: 91.1055,
    isWithinRange: false, // ~140m away
  },
  {
    id: "branch_009",
    name: "Highway Branch",
    address: "X4N4+2J2, Brahmanbaria Highway, Bangladesh",
    latitude: 23.9858,
    longitude: 91.1075,
    isWithinRange: false, // ~290m away
  },
  {
    id: "branch_010",
    name: "Airport Branch",
    address: "X4L4+5J5, Brahmanbaria Airport Road, Bangladesh",
    latitude: 23.9805,
    longitude: 91.104,
    isWithinRange: false, // ~450m away
  },
];

// Helper function to calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Helper function to check if location is within valid range
export const isLocationValid = (
  userLat: number,
  userLon: number,
  branchLat: number,
  branchLon: number
): boolean => {
  const distance = calculateDistance(userLat, userLon, branchLat, branchLon);
  return distance <= MAX_BRANCH_DISTANCE;
};

// Get branch by ID
export const getBranchById = (id: string): BranchLocation | undefined => {
  return SAMPLE_BRANCH_LOCATIONS.find((branch) => branch.id === id);
};

// Get branches within range
export const getBranchesWithinRange = (): BranchLocation[] => {
  return SAMPLE_BRANCH_LOCATIONS.filter((branch) => branch.isWithinRange);
};

// Get branches outside range
export const getBranchesOutsideRange = (): BranchLocation[] => {
  return SAMPLE_BRANCH_LOCATIONS.filter((branch) => !branch.isWithinRange);
};
