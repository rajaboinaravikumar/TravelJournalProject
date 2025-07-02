export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Added for authentication
  profileImage?: string; // Optional profile image URL
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  token: string | null;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Journal {
  _id: string;
  title?: string; // Optional title field
  location: string;
  images: string[];
  tags: string[];
  friendsMentioned: string[];
  entry: string;
  user: string | {
    _id: string;
    firstName?: string;
    email?: string;
    profileImage?: string;
    profilePhoto?: string;
  };
  createdAt: string;
  updatedAt?: string;
  likes?: string[];
  comments?: any[];
}

export interface JournalState {
  journals: Journal[];
  error: string | null;
}
