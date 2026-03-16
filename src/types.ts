export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  slot: string;
  players: number;
  amount: number;
  paymentScreenshot: string; // Base64 or URL
  matchName?: string;
  matchId?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface TurfSettings {
  name: string;
  tagline: string;
  description: string;
  pricePerPlayer: number;
  minPlayers: number;
  maxPlayers: number;
  googleMapsLink: string;
  timeSlots: string[];
  openingTime: string;
  closingTime: string;
  upiId: string;
  upiQrCode: string;
  bankDetails: string;
  contactPhone: string;
  contactEmail: string;
  fixedDate: string;
  fixedTime: string;
  maxTotalSlots: number;
  matchName: string;
  matchId: string;
  gallery: string[];
  announcement: {
    text: string;
    show: boolean;
  };
}

export const DEFAULT_SETTINGS: TurfSettings = {
  name: "Premium Box Cricket Turf",
  tagline: "Experience Cricket Under the Lights",
  description: "State-of-the-art box cricket turf with high-quality artificial grass, LED floodlights, and premium amenities.",
  pricePerPlayer: 150,
  minPlayers: 12,
  maxPlayers: 14,
  googleMapsLink: "https://maps.google.com",
  timeSlots: [
    "06:00 AM - 07:00 AM",
    "07:00 AM - 08:00 AM",
    "08:00 AM - 09:00 AM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM",
    "08:00 PM - 09:00 PM",
    "09:00 PM - 10:00 PM",
    "10:00 PM - 11:00 PM",
  ],
  openingTime: "06:00",
  closingTime: "23:00",
  upiId: "hiren@upi",
  upiQrCode: "",
  bankDetails: "Bank: HDFC Bank\nA/c Name: Turf Book\nA/c No: 1234567890\nIFSC: HDFC0001234",
  contactPhone: "9898243002",
  contactEmail: "cahirensoni2001@gmail.com",
  fixedDate: new Date().toISOString().split('T')[0],
  fixedTime: "06:00 PM - 09:00 PM (3 Hours)",
  maxTotalSlots: 14,
  matchName: "Sunday Bash Phase 1",
  matchId: "M-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
  gallery: [
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1529764958189-38f17a9d59ed?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1522863700055-e7cf45934673?auto=format&fit=crop&q=80&w=1600",
  ],
  announcement: {
    text: "Diwali Special: 20% OFF on weekend bookings!",
    show: true,
  }
};
