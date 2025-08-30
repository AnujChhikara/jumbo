export type Geo = {
  lat: string;
  lng: string;
};

export type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
};

export type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

export type UsersResponse = User[];

export type UserFilters = {
  search?: string;
  company?: string;
  sortBy?: 'name' | 'email' | 'company';
  sortOrder?: 'asc' | 'desc';
};

export type UserTableColumn = {
  key: keyof User | 'actions';
  label: string;
  sortable?: boolean;
  filterable?: boolean;
};

export type CreateUserRequest = Omit<User, 'id'>;

export type UpdateUserRequest = Partial<CreateUserRequest> & {
  id: number;
};

export type UseUsersReturn = {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export type UseUserFiltersReturn = {
  filters: UserFilters;
  setSearch: (search: string) => void;
  setCompany: (company: string) => void;
  setSortBy: (sortBy: UserFilters['sortBy']) => void;
  setSortOrder: (sortOrder: UserFilters['sortOrder']) => void;
  clearFilters: () => void;
};
