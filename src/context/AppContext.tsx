import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Booking, TurfSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  settings: TurfSettings;
  setSettings: (settings: TurfSettings) => Promise<void>;
  bookings: Booking[];
  addBooking: (booking: Booking) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  loading: boolean;
  isConfigured: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<TurfSettings>(DEFAULT_SETTINGS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const isConfigured = !import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') && !!import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    if (isConfigured) {
      fetchInitialData();
    } else {
      console.warn('Supabase not configured. Using Local Storage fallback.');
      
      // Load from Local Storage
      const localSettings = localStorage.getItem('turf_settings');
      if (localSettings) {
        try { setSettingsState(JSON.parse(localSettings)); } catch (e) {}
      }
      
      const localBookings = localStorage.getItem('turf_bookings');
      if (localBookings) {
        try { setBookings(JSON.parse(localBookings)); } catch (e) {}
      }
      
      setLoading(false);
    }
  }, [isConfigured]);

  const fetchInitialData = async () => {
    try {
      // Fetch Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('turf_settings')
        .select('*')
        .single();

      if (settingsError) {
        console.error('Settings Fetch Error:', settingsError);
      }

      if (settingsData) {
        setSettingsState({
          name: settingsData.name,
          tagline: settingsData.tagline,
          description: settingsData.description,
          pricePerPlayer: settingsData.price_per_player,
          minPlayers: settingsData.min_players,
          maxPlayers: settingsData.max_players,
          googleMapsLink: settingsData.google_maps_link,
          timeSlots: settingsData.time_slots,
          openingTime: settingsData.opening_time,
          closingTime: settingsData.closing_time,
          upiId: settingsData.upi_id,
          upiQrCode: settingsData.upi_qr_code,
          bankDetails: settingsData.bank_details,
          contactPhone: settingsData.contact_phone,
          contactEmail: settingsData.contact_email,
          fixedDate: settingsData.fixed_date,
          fixedTime: settingsData.fixed_time,
          maxTotalSlots: settingsData.max_total_slots,
          matchName: settingsData.match_name || 'Sunday Bash Phase 1',
          matchId: settingsData.match_id || 'M-101',
          gallery: settingsData.gallery,
          announcement: settingsData.announcement,
        });
      }

      // Fetch Bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Bookings Fetch Error:', bookingsError);
      }

      if (bookingsData) {
        setBookings(bookingsData.map((b: any) => ({
          id: b.id,
          name: b.name,
          phone: b.phone,
          email: b.email,
          date: b.date,
          slot: b.slot,
          players: b.players,
          amount: b.amount,
          paymentScreenshot: b.payment_screenshot,
          matchName: b.match_name,
          matchId: b.match_id,
          status: b.status,
          createdAt: b.created_at,
        })));
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const setSettings = async (newSettings: TurfSettings) => {
    if (!isConfigured) {
      localStorage.setItem('turf_settings', JSON.stringify(newSettings));
      setSettingsState(newSettings);
      return;
    }

    try {
      const { error } = await supabase
        .from('turf_settings')
        .upsert({
          id: 1,
          name: newSettings.name,
          tagline: newSettings.tagline,
          description: newSettings.description,
          price_per_player: newSettings.pricePerPlayer,
          min_players: newSettings.minPlayers,
          max_players: newSettings.maxPlayers,
          google_maps_link: newSettings.googleMapsLink,
          time_slots: newSettings.timeSlots,
          opening_time: newSettings.openingTime,
          closing_time: newSettings.closingTime,
          upi_id: newSettings.upiId,
          upi_qr_code: newSettings.upiQrCode,
          bank_details: newSettings.bankDetails,
          contact_phone: newSettings.contactPhone,
          contact_email: newSettings.contactEmail,
          fixed_date: newSettings.fixedDate,
          fixed_time: newSettings.fixedTime,
          max_total_slots: newSettings.maxTotalSlots,
          match_name: newSettings.matchName,
          match_id: newSettings.matchId,
          gallery: newSettings.gallery,
          announcement: newSettings.announcement,
        });

      if (!error) {
        setSettingsState(newSettings);
      } else {
        throw error;
      }
    } catch (error: any) {
      console.error('Error updating settings:', error);
      alert(`Cloud Update Failed: ${error.message || 'Check your internet or Supabase URL'}`);
    }
  };

  const addBooking = async (booking: Booking) => {
    if (!isConfigured) {
      const newBookings = [booking, ...bookings];
      localStorage.setItem('turf_bookings', JSON.stringify(newBookings));
      setBookings(newBookings);
      alert('Booking saved LOCALLY. Add Supabase keys to save to cloud.');
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          id: booking.id,
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
          date: booking.date,
          slot: booking.slot,
          players: booking.players,
          amount: booking.amount,
          payment_screenshot: booking.paymentScreenshot,
          match_name: booking.matchName,
          match_id: booking.matchId,
          status: booking.status,
          created_at: booking.createdAt,
        });

      if (!error) {
        setBookings(prev => [booking, ...prev]);
      } else {
        throw error;
      }
    } catch (error: any) {
      console.error('Error adding booking:', error);
      alert(`Cloud Booking Failed: ${error.message || 'Check Supabase permissions'}`);
      throw error;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    if (!isConfigured) {
      const newBookings = bookings.map(b => b.id === id ? { ...b, status } : b);
      localStorage.setItem('turf_bookings', JSON.stringify(newBookings));
      setBookings(newBookings);
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (!error) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <AppContext.Provider value={{ settings, setSettings, bookings, addBooking, updateBookingStatus, loading, isConfigured }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
