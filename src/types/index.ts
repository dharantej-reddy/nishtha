// User related types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  profileImage?: string;
  age?: number;
  location?: string;
  preferredReligion?: string[];
  followers: number;
  following: number;
  verificationStatus: 'verified' | 'unverified' | 'pending';
  createdAt: string;
  updatedAt: string;
}

// Place of Worship types
export interface PlaceOfWorship {
  id: string;
  name: string;
  type: 'temple' | 'church' | 'mosque' | 'synagogue' | 'gurudwara' | 'buddhist_temple' | 'other';
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  description: string;
  history: string;
  languages: string[];
  timings: {
    [key: string]: { open: string; close: string; };
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  priests: Priest[];
  followers: number;
  rating: number;
  reviews: Review[];
  amenities: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Priest/Religious Leader types
export interface Priest {
  id: string;
  name: string;
  title: string;
  profileImage?: string;
  placeOfWorshipId: string;
  specialties: string[];
  languages: string[];
  experience: number;
  rating: number;
  availableForHomeService: boolean;
  homeServiceRadius: number; // in kilometers
  homeServicePrice: number;
  contactInfo: {
    phone?: string;
    email?: string;
  };
  schedule: WeeklySchedule;
}

export interface WeeklySchedule {
  [key: string]: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  type: 'general' | 'special_service' | 'consultation';
}

// Live Streaming types
export interface LiveEvent {
  id: string;
  placeOfWorshipId: string;
  title: string;
  description: string;
  type: 'prayer' | 'pooja' | 'ceremony' | 'cultural_event' | 'teaching' | 'festival';
  startTime: string;
  endTime?: string;
  streamUrl: string;
  thumbnailUrl: string;
  isLive: boolean;
  viewerCount: number;
  likes: number;
  comments: Comment[];
  language: string;
  tags: string[];
  admSettings: {
    showAds: boolean;
    adFrequency: number; // seconds between ads
  };
}

export interface RecordedEvent {
  id: string;
  placeOfWorshipId: string;
  title: string;
  description: string;
  type: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  uploadDate: string;
  tags: string[];
  monetization: {
    enabled: boolean;
    pricePerView: number;
    totalEarnings: number;
  };
}

// Marketplace types
export interface MarketplaceItem {
  id: string;
  placeOfWorshipId: string;
  sellerId: string;
  title: string;
  description: string;
  category: 'prasad' | 'religious_books' | 'clothing' | 'artifacts' | 'music' | 'incense' | 'other';
  images: string[];
  price: number;
  currency: string;
  inStock: number;
  rating: number;
  reviews: Review[];
  shippingInfo: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingCost?: number;
  };
  isDigital: boolean;
  downloadUrl?: string;
  createdAt: string;
}

// Booking types
export interface ServiceBooking {
  id: string;
  userId: string;
  placeOfWorshipId: string;
  priestId?: string;
  serviceType: 'home_service' | 'special_pooja' | 'consultation' | 'guide_tour' | 'event_ticket';
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  address?: string; // for home services
  specialRequests?: string;
  participants: number;
  createdAt: string;
}

export interface EventTicket {
  id: string;
  eventId: string;
  placeOfWorshipId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  ticketType: 'general' | 'vip' | 'premium';
  price: number;
  quantity: number;
  totalPrice: number;
  qrCode: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
}

// Travel types
export interface TravelPlan {
  id: string;
  userId: string;
  title: string;
  destinations: PlaceOfWorship[];
  startDate: string;
  endDate: string;
  totalDistance: number;
  estimatedCost: number;
  transportMode: 'car' | 'bus' | 'train' | 'flight' | 'mixed';
  route: RoutePoint[];
  accommodations: Accommodation[];
  activities: Activity[];
  viewpoints: Viewpoint[];
  status: 'planning' | 'booked' | 'active' | 'completed';
  createdAt: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  address: string;
  estimatedArrival: string;
  placeOfWorshipId?: string;
  viewpointId?: string;
}

export interface Viewpoint {
  id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  rating: number;
  bestTime: string;
  duration: number; // recommended visit duration in minutes
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'guest_house' | 'dharamshala' | 'ashram';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  pricePerNight: number;
  rating: number;
  amenities: string[];
  contactInfo: {
    phone: string;
    email?: string;
  };
}

// Community types
export interface CommunityPost {
  id: string;
  userId: string;
  ageGroup: '13-17' | '18-25' | '26-35' | '36-50' | '51-65' | '65+';
  title: string;
  content: string;
  images?: string[];
  type: 'question' | 'experience' | 'advice' | 'discussion' | 'announcement';
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  placeOfWorshipId?: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: string;
}

// Donation types
export interface Donation {
  id: string;
  userId: string;
  placeOfWorshipId: string;
  amount: number;
  currency: string;
  purpose: 'general' | 'maintenance' | 'event' | 'charity' | 'construction' | 'education';
  message?: string;
  anonymous: boolean;
  paymentMethod: 'card' | 'bank_transfer' | 'digital_wallet';
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}

export interface DonationCampaign {
  id: string;
  placeOfWorshipId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  endDate: string;
  images: string[];
  status: 'active' | 'completed' | 'expired';
  donors: DonorInfo[];
  createdAt: string;
}

export interface DonorInfo {
  userId?: string;
  name: string;
  amount: number;
  message?: string;
  anonymous: boolean;
  donatedAt: string;
}

// Transportation types
export interface CabBooking {
  id: string;
  userId: string;
  pickup: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  destination: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  scheduledTime: string;
  cabType: 'mini' | 'sedan' | 'suv' | 'shared';
  estimatedPrice: number;
  actualPrice?: number;
  driverInfo?: DriverInfo;
  status: 'booked' | 'assigned' | 'pickup' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicleInfo: {
    model: string;
    plateNumber: string;
    color: string;
  };
}

// Common types
export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  price?: number;
  duration: number;
  rating: number;
  category: 'cultural' | 'spiritual' | 'historical' | 'adventure' | 'food';
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  PlaceDetails: { placeId: string };
  LiveStream: { eventId: string };
  VideoPlayer: { videoId: string };
  BookingDetails: { bookingId: string };
  TravelPlan: { planId?: string };
  Profile: { userId?: string };
  MarketplaceItem: { itemId: string };
  DonationCampaign: { campaignId: string };
  CommunityPost: { postId: string };
};

export type BottomTabParamList = {
  Home: undefined;
  Explore: undefined;
  Live: undefined;
  Community: undefined;
  Profile: undefined;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter types
export interface SearchFilters {
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  type?: string[];
  rating?: number;
  amenities?: string[];
  language?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: 'rating' | 'distance' | 'price' | 'popularity' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

// Notification types
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'live_event' | 'booking_confirmation' | 'donation_received' | 'new_follower' | 'community_post' | 'system';
  isRead: boolean;
  data?: any;
  createdAt: string;
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  details: {
    cardNumber?: string; // masked
    expiryMonth?: number;
    expiryYear?: number;
    bankName?: string;
    accountNumber?: string; // masked
    walletProvider?: string;
  };
  isDefault: boolean;
  createdAt: string;
}