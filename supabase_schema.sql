-- Create the settings table
CREATE TABLE IF NOT EXISTS turf_settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price_per_player NUMERIC NOT NULL,
  min_players INTEGER NOT NULL,
  max_players INTEGER NOT NULL,
  google_maps_link TEXT,
  time_slots JSONB,
  opening_time TEXT,
  closing_time TEXT,
  upi_id TEXT,
  upi_qr_code TEXT,
  bank_details TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  fixed_date TEXT,
  fixed_time TEXT,
  max_total_slots INTEGER,
  gallery JSONB,
  announcement JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  date TEXT NOT NULL,
  slot TEXT NOT NULL,
  players INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  payment_screenshot TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS to allow public/anon access for this simple project
ALTER TABLE turf_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Insert default settings if it doesn't exist
INSERT INTO turf_settings (
  id, name, tagline, description, price_per_player, min_players, max_players, 
  google_maps_link, time_slots, opening_time, closing_time, upi_id, upi_qr_code, 
  bank_details, contact_phone, contact_email, fixed_date, fixed_time, max_total_slots, 
  gallery, announcement
)
VALUES (
  1, 
  'Premium Box Cricket Turf', 
  'Experience Cricket Under the Lights', 
  'State-of-the-art box cricket turf with high-quality artificial grass, LED floodlights, and premium amenities.', 
  150, 
  12, 
  14, 
  'https://maps.google.com', 
  '["06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM", "09:00 PM - 10:00 PM", "10:00 PM - 11:00 PM"]', 
  '06:00', 
  '23:00', 
  'hiren@upi', 
  '', 
  'Bank: HDFC Bank\nA/c Name: Turf Book\nA/c No: 1234567890\nIFSC: HDFC0001234', 
  '9898243002', 
  'cahirensoni2001@gmail.com', 
  '2026-03-16', 
  '06:00 PM - 09:00 PM (3 Hours)', 
  14, 
  '["https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1529764958189-38f17a9d59ed?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1522863700055-e7cf45934673?auto=format&fit=crop&q=80&w=1600"]', 
  '{"text": "Diwali Special: 20% OFF on weekend bookings!", "show": true}'
) ON CONFLICT (id) DO NOTHING;
