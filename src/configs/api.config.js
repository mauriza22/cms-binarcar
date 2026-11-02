/** @format */

import axios from 'axios';

export const API_BASE_URL = 'https://binar-car-management-dashboard.fly.dev';

const CAR_IMAGE_BASE = 'https://raw.githubusercontent.com/fnurhidayat/probable-garbanzo/main/public/images/';
const IMAGE_CACHE_KEY = 'cms-car-image-cache';

const readImageCache = () => {
  try {
    return JSON.parse(localStorage.getItem(IMAGE_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const rememberCarImage = (filename, dataUrl) => {
  if (!filename || !dataUrl?.startsWith('data:')) return;
  try {
    const cache = readImageCache();
    cache[filename] = dataUrl;
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Browser storage can reject a very large photo. The car is still saved.
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('TOKEN');
      const path = window.location.pathname;
      if (path !== '/' && path !== '/login') {
        sessionStorage.setItem('AUTH_ERROR', 'Sesi login habis. Silakan masuk lagi.');
        window.location.replace('/');
      }
    }
    return Promise.reject(error);
  }
);

export const carImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('data:') || image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  const cached = readImageCache()[image];
  if (cached) return cached;
  return `${CAR_IMAGE_BASE}${image}`;
};
