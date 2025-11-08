import { DepartmentResponse } from '../lib/schemas/department-schemas';
import { LocationResponse } from '../lib/schemas/location-schemas';
import { RoleResponse } from '../lib/schemas/role-schemas';
import { UserResponse } from '../lib/schemas/user-schemas';

// Mock Users Data
export const mockUsers: UserResponse[] = [
  {
    id: 1,
    email: 'john.doe@company.com',
    username: 'john.doe',
    full_name: 'John Doe',
    phone: '+1-555-0123',
    address: '123 Main St, New York, NY 10001',
    is_active: true,
    is_verified: true,
    is_superuser: false,
    created_at: '2024-01-15T08:30:00Z',
    updated_at: '2024-01-20T14:22:00Z',
    last_login: '2024-01-25T09:15:00Z',
    roles: ['Manager', 'User'],
    profile_image: undefined,
  },
  {
    id: 2,
    email: 'jane.smith@company.com',
    username: 'jane.smith',
    full_name: 'Jane Smith',
    phone: '+1-555-0124',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    is_active: true,
    is_verified: true,
    is_superuser: true,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-22T16:45:00Z',
    last_login: '2024-01-25T11:30:00Z',
    roles: ['Admin', 'Manager'],
    profile_image: undefined,
  },
  {
    id: 3,
    email: 'mike.johnson@company.com',
    username: 'mike.johnson',
    full_name: 'Mike Johnson',
    phone: '+1-555-0125',
    address: '789 Pine St, Chicago, IL 60601',
    is_active: false,
    is_verified: true,
    is_superuser: false,
    created_at: '2024-01-12T14:20:00Z',
    updated_at: '2024-01-18T12:10:00Z',
    last_login: '2024-01-20T15:45:00Z',
    roles: ['User'],
    profile_image: undefined,
  },
  {
    id: 4,
    email: 'sarah.wilson@company.com',
    username: 'sarah.wilson',
    full_name: 'Sarah Wilson',
    phone: '+1-555-0126',
    address: '321 Elm St, Houston, TX 77001',
    is_active: true,
    is_verified: false,
    is_superuser: false,
    created_at: '2024-01-18T09:15:00Z',
    updated_at: '2024-01-24T13:30:00Z',
    last_login: null,
    roles: ['User'],
    profile_image: undefined,
  },
];

// Mock Roles Data
export const mockRoles: RoleResponse[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system administrator with all permissions',
    permissions: ['create_user', 'edit_user', 'delete_user', 'manage_roles', 'manage_departments', 'view_reports'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    users_count: 1,
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Department manager with limited administrative permissions',
    permissions: ['view_user', 'edit_user', 'manage_departments', 'view_reports'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T14:20:00Z',
    users_count: 2,
  },
  {
    id: 3,
    name: 'User',
    description: 'Standard user with basic permissions',
    permissions: ['view_profile', 'edit_profile'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-05T16:45:00Z',
    users_count: 4,
  },
  {
    id: 4,
    name: 'HR Manager',
    description: 'Human Resources manager with employee management permissions',
    permissions: ['view_user', 'edit_user', 'manage_employees', 'view_reports'],
    created_at: '2024-01-08T12:00:00Z',
    updated_at: '2024-01-20T09:15:00Z',
    users_count: 0,
  },
];

// Mock Departments Data
export const mockDepartments: DepartmentResponse[] = [
  {
    id: 1,
    name: 'Engineering',
    description: 'Software development and technical operations',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Human Resources',
    description: 'Employee management and organizational development',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T14:20:00Z',
  },
  {
    id: 3,
    name: 'Marketing',
    description: 'Brand promotion and customer acquisition',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-12T16:45:00Z',
  },
  {
    id: 4,
    name: 'Finance',
    description: 'Financial planning and accounting operations',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-18T11:20:00Z',
  },
  {
    id: 5,
    name: 'Operations',
    description: 'Daily business operations and logistics',
    is_active: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-22T13:10:00Z',
  },
];

// Mock Locations Data
export const mockLocations: LocationResponse[] = [
  {
    id: '1',
    name: 'New York Headquarters',
    location_type: 'Office',
    address: '123 Broadway, Suite 1500',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    country: 'United States',
    phone: '+1-212-555-0100',
    email: 'ny.office@company.com',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Los Angeles Branch',
    location_type: 'Branch',
    address: '456 Sunset Boulevard',
    city: 'Los Angeles',
    state: 'CA',
    postal_code: '90210',
    country: 'United States',
    phone: '+1-323-555-0200',
    email: 'la.branch@company.com',
    is_active: true,
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-20T14:22:00Z',
  },
  {
    id: '3',
    name: 'Chicago Warehouse',
    location_type: 'Warehouse',
    address: '789 Industrial Drive',
    city: 'Chicago',
    state: 'IL',
    postal_code: '60601',
    country: 'United States',
    phone: '+1-312-555-0300',
    email: 'chicago.warehouse@company.com',
    is_active: true,
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-01-18T16:45:00Z',
  },
  {
    id: '4',
    name: 'Miami Sales Office',
    location_type: 'Office',
    address: '321 Ocean Drive, Floor 8',
    city: 'Miami',
    state: 'FL',
    postal_code: '33139',
    country: 'United States',
    phone: '+1-305-555-0400',
    email: 'miami.sales@company.com',
    is_active: true,
    created_at: '2024-01-12T09:30:00Z',
    updated_at: '2024-01-22T11:15:00Z',
  },
  {
    id: '5',
    name: 'Seattle Tech Hub',
    location_type: 'Office',
    address: '555 Pine Street, Suite 2000',
    city: 'Seattle',
    state: 'WA',
    postal_code: '98101',
    country: 'United States',
    phone: '+1-206-555-0500',
    email: 'seattle.tech@company.com',
    is_active: true,
    created_at: '2024-01-15T14:00:00Z',
    updated_at: '2024-01-25T09:30:00Z',
  },
  {
    id: '6',
    name: 'Dallas Distribution Center',
    location_type: 'Warehouse',
    address: '1000 Commerce Street',
    city: 'Dallas',
    state: 'TX',
    postal_code: '75201',
    country: 'United States',
    phone: '+1-214-555-0600',
    email: 'dallas.distribution@company.com',
    is_active: false,
    created_at: '2024-01-08T10:15:00Z',
    updated_at: '2024-01-20T13:45:00Z',
  },
];

// Mock Data Service Class
export class MockDataService {
  // User methods
  static getUserById(id: number): UserResponse | undefined {
    return mockUsers.find(user => user.id === id);
  }

  static getAllUsers(params?: { search?: string; skip?: number; limit?: number }) {
    let filteredUsers = [...mockUsers];
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.full_name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
      );
    }
    
    const skip = params?.skip || 0;
    const limit = params?.limit || 10;
    const paginatedUsers = filteredUsers.slice(skip, skip + limit);
    
    return {
      users: paginatedUsers,
      total: filteredUsers.length,
    };
  }

  // Role methods
  static getRoleById(id: number): RoleResponse | undefined {
    return mockRoles.find(role => role.id === id);
  }

  static getAllRoles(params?: { search?: string; skip?: number; limit?: number }) {
    let filteredRoles = [...mockRoles];
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredRoles = filteredRoles.filter(role => 
        role.name.toLowerCase().includes(searchTerm) ||
        role.description.toLowerCase().includes(searchTerm)
      );
    }
    
    const skip = params?.skip || 0;
    const limit = params?.limit || 10;
    const paginatedRoles = filteredRoles.slice(skip, skip + limit);
    
    return {
      roles: paginatedRoles,
      total: filteredRoles.length,
    };
  }

  // Department methods
  static getDepartmentById(id: number): DepartmentResponse | undefined {
    return mockDepartments.find(dept => dept.id === id);
  }

  static getAllDepartments(params?: { search?: string; skip?: number; limit?: number; is_active?: boolean }) {
    let filteredDepartments = [...mockDepartments];
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredDepartments = filteredDepartments.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm) ||
        dept.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (params?.is_active !== undefined) {
      filteredDepartments = filteredDepartments.filter(dept => dept.is_active === params.is_active);
    }
    
    const skip = params?.skip || 0;
    const limit = params?.limit || 10;
    const paginatedDepartments = filteredDepartments.slice(skip, skip + limit);
    
    return {
      departments: paginatedDepartments,
      total: filteredDepartments.length,
    };
  }

  // Utility methods
  static getUsersByRole(roleName: string): UserResponse[] {
    return mockUsers.filter(user => user.roles.includes(roleName));
  }

  static getRolesByUser(userId: number): string[] {
    const user = this.getUserById(userId);
    return user?.roles || [];
  }

  // ===== LOCATION METHODS =====

  static getLocationById(id: string): LocationResponse | undefined {
    return mockLocations.find(location => location.id === id);
  }

  static getAllLocations(params?: { search?: string; skip?: number; limit?: number; location_type?: string; city?: string; is_active?: boolean }) {
    let filteredLocations = [...mockLocations];

    // Apply filters
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredLocations = filteredLocations.filter(location => 
        location.name.toLowerCase().includes(searchLower) ||
        location.address.toLowerCase().includes(searchLower) ||
        location.city.toLowerCase().includes(searchLower) ||
        location.location_type.toLowerCase().includes(searchLower)
      );
    }

    if (params?.location_type) {
      filteredLocations = filteredLocations.filter(location => 
        location.location_type.toLowerCase() === params.location_type!.toLowerCase()
      );
    }

    if (params?.city) {
      filteredLocations = filteredLocations.filter(location => 
        location.city.toLowerCase() === params.city!.toLowerCase()
      );
    }

    if (params?.is_active !== undefined) {
      filteredLocations = filteredLocations.filter(location => location.is_active === params.is_active);
    }

    const total = filteredLocations.length;
    const skip = params?.skip || 0;
    const limit = params?.limit || 100;
    const locations = filteredLocations.slice(skip, skip + limit);

    return {
      data: locations,
      total,
      skip,
      limit
    };
  }

  static getLocationsByType(locationType: string): LocationResponse[] {
    return mockLocations.filter(location => 
      location.location_type.toLowerCase() === locationType.toLowerCase()
    );
  }

  static getLocationsByCity(city: string): LocationResponse[] {
    return mockLocations.filter(location => 
      location.city.toLowerCase() === city.toLowerCase()
    );
  }

  static getActiveLocations(): LocationResponse[] {
    return mockLocations.filter(location => location.is_active);
  }

  // ===== BRANCHES METHODS =====
  static getAllBranches(params?: { search?: string; skip?: number; limit?: number; city?: string; is_active?: boolean }) {
    let branches = mockLocations.filter(location => location.location_type === 'Branch');

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      branches = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchLower) ||
        branch.city.toLowerCase().includes(searchLower) ||
        branch.state.toLowerCase().includes(searchLower) ||
        branch.address.toLowerCase().includes(searchLower)
      );
    }

    if (params?.city) {
      branches = branches.filter(branch => branch.city.toLowerCase() === params.city!.toLowerCase());
    }

    if (params?.is_active !== undefined) {
      branches = branches.filter(branch => branch.is_active === params.is_active);
    }

    const skip = params?.skip || 0;
    const limit = params?.limit || branches.length;
    const paginatedBranches = branches.slice(skip, skip + limit);

    return {
      items: paginatedBranches,
      total: branches.length,
      skip,
      limit,
    };
  }

  static getBranchById(id: string): LocationResponse | undefined {
    return mockLocations.find(location => location.id === id && location.location_type === 'Branch');
  }

  static getActiveBranches(): LocationResponse[] {
    return mockLocations.filter(location => location.location_type === 'Branch' && location.is_active);
  }

  // ===== WAREHOUSES METHODS =====
  static getAllWarehouses(params?: { search?: string; skip?: number; limit?: number; city?: string; is_active?: boolean }) {
    let warehouses = mockLocations.filter(location => location.location_type === 'Warehouse');

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      warehouses = warehouses.filter(warehouse =>
        warehouse.name.toLowerCase().includes(searchLower) ||
        warehouse.city.toLowerCase().includes(searchLower) ||
        warehouse.state.toLowerCase().includes(searchLower) ||
        warehouse.address.toLowerCase().includes(searchLower)
      );
    }

    if (params?.city) {
      warehouses = warehouses.filter(warehouse => warehouse.city.toLowerCase() === params.city!.toLowerCase());
    }

    if (params?.is_active !== undefined) {
      warehouses = warehouses.filter(warehouse => warehouse.is_active === params.is_active);
    }

    const skip = params?.skip || 0;
    const limit = params?.limit || warehouses.length;
    const paginatedWarehouses = warehouses.slice(skip, skip + limit);

    return {
      items: paginatedWarehouses,
      total: warehouses.length,
      skip,
      limit,
    };
  }

  static getWarehouseById(id: string): LocationResponse | undefined {
    return mockLocations.find(location => location.id === id && location.location_type === 'Warehouse');
  }

  static getActiveWarehouses(): LocationResponse[] {
    return mockLocations.filter(location => location.location_type === 'Warehouse' && location.is_active);
  }
}