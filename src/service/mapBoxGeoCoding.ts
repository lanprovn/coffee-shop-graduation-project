/**
 * Mock Mapbox Geocoding Service - Frontend Only
 * 
 * Thay thế Mapbox API calls bằng mock data
 * Không có API calls thực đến Mapbox
 */

import { LatLng } from '@/types';

export const getAddrFromCoordinate = async (
  coordinate: LatLng
): Promise<string> => {
  try {
    // Mock implementation - simulate API delay
    const API_DELAY_MS = 500;
    await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

    // Mock address data based on coordinates
    const mockAddresses = [
      '123 Đường ABC, Quận 1, TP.HCM',
      '456 Đường XYZ, Quận 2, TP.HCM',
      '789 Đường DEF, Quận 3, TP.HCM',
      '321 Đường GHI, Quận 4, TP.HCM',
      '654 Đường JKL, Quận 5, TP.HCM'
    ];

    // Use coordinates to determine mock address
    const index = Math.abs(Math.floor(coordinate.lat + coordinate.lng)) % mockAddresses.length;
    const mockAddress = mockAddresses[index];

    // Mock Mapbox Geocoding: Returning mock address
    // console.log('Mock Mapbox Geocoding: Returning mock address:', mockAddress);
    return mockAddress;
  } catch (error) {
    // Mock Mapbox Geocoding Error logged for development
    // console.error('Mock Mapbox Geocoding Error:', error);
    return 'Địa chỉ không xác định';
  }
};