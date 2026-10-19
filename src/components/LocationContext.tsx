"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationData {
  id: string;
  name: string;
  district: string;
  admin1?: string;
  country: string;
  lat: number;
  lng: number;
}

export const PRESET_LOCATIONS: LocationData[] = [
  { id: 'madurai', name: 'Madurai (மதுரை)', district: 'Madurai', admin1: 'Tamil Nadu', country: 'India', lat: 9.9252, lng: 78.1198 },
  { id: 'pollachi', name: 'Pollachi (பொள்ளாச்சி)', district: 'Coimbatore', admin1: 'Tamil Nadu', country: 'India', lat: 10.6582, lng: 77.0084 },
  { id: 'thanjavur', name: 'Thanjavur (தஞ்சாவூர்)', district: 'Thanjavur', admin1: 'Tamil Nadu', country: 'India', lat: 10.7870, lng: 79.1378 },
  { id: 'erode', name: 'Gobichettipalayam (கோபிசெட்டிபாளையம்)', district: 'Erode', admin1: 'Tamil Nadu', country: 'India', lat: 11.4552, lng: 77.4384 },
  { id: 'tenkasi', name: 'Tenkasi (தென்காசி)', district: 'Tenkasi', admin1: 'Tamil Nadu', country: 'India', lat: 8.9594, lng: 77.3142 },
  { id: 'salem', name: 'Salem (சேலம்)', district: 'Salem', admin1: 'Tamil Nadu', country: 'India', lat: 11.6643, lng: 78.1460 },
  { id: 'trichy', name: 'Trichy (திருச்சி)', district: 'Tiruchirappalli', admin1: 'Tamil Nadu', country: 'India', lat: 10.7905, lng: 78.7047 },
  { id: 'dindigul', name: 'Dindigul (திண்டுக்கல்)', district: 'Dindigul', admin1: 'Tamil Nadu', country: 'India', lat: 10.3673, lng: 77.9803 },
];

interface LocationContextType {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
  presets: LocationData[];
  isDetecting: boolean;
  detectLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationData>(PRESET_LOCATIONS[0]);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('kisan_mitra_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.lat && parsed.lng) {
          setLocationState(parsed);
        }
      } catch (e) {
        // Fallback to default
      }
    }
  }, []);

  const setLocation = React.useCallback((loc: LocationData) => {
    setLocationState(loc);
    try {
      localStorage.setItem('kisan_mitra_location', JSON.stringify(loc));
    } catch (e) {
      console.warn('Could not save location to localStorage:', e);
    }
  }, []);

  const detectLocation = React.useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          // Reverse geocoding via Open-Meteo or BigDataCloud
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lng.toFixed(2)}&count=1`
          );
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const place = data.results[0];
            const newLoc: LocationData = {
              id: 'detected-geo',
              name: place.name || 'Current Location',
              district: place.admin2 || place.admin1 || 'Your District',
              admin1: place.admin1 || '',
              country: place.country || 'India',
              lat,
              lng,
            };
            setLocation(newLoc);
          } else {
            setLocation({
              id: 'detected-geo',
              name: 'My Farm Location',
              district: 'Local District',
              country: 'India',
              lat,
              lng,
            });
          }
        } catch (e) {
          setLocation({
            id: 'detected-geo',
            name: 'My Farm Location',
            district: 'Local District',
            country: 'India',
            lat,
            lng,
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.warn('Geolocation access denied or unavailable:', error);
        setIsDetecting(false);
      },
      { timeout: 8000 }
    );
  }, [setLocation]);

  const value = React.useMemo(
    () => ({ location, setLocation, presets: PRESET_LOCATIONS, isDetecting, detectLocation }),
    [location, setLocation, isDetecting, detectLocation]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
