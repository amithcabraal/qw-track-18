import { getStoredAccessToken } from '../utils/auth';

export const useAuth = () => {
  const isAuthenticated = Boolean(getStoredAccessToken());
  return { isAuthenticated };
};