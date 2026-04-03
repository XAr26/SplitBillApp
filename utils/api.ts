import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Gunakan 10.0.2.2 untuk Android Emulator, localhost untuk iOS/Web
// GANTI DENGAN IP KOMPUTER ANDA (misal: 192.168.1.5) jika memakai HP fisik di jaringan WiFi.
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api');

// Helper API Fetcher
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as object),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Terjadi kesalahan pada server');
  }

  return data;
};
