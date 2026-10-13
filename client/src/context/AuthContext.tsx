import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  toggleWishlist: (propertyId: string) => Promise<boolean>;
  isWishlisted: (propertyId: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error('Failed to authenticate token:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const toggleWishlist = async (propertyId: string): Promise<boolean> => {
    if (!user) {
      // Local fallback for guest wishlist
      const saved = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
      const index = saved.indexOf(propertyId);
      let isSaved = false;
      if (index > -1) {
        saved.splice(index, 1);
        isSaved = false;
      } else {
        saved.push(propertyId);
        isSaved = true;
      }
      localStorage.setItem('guest_wishlist', JSON.stringify(saved));
      setUser((prev) => (prev ? { ...prev, savedProperties: saved } : null));
      return isSaved;
    }

    try {
      const res = await api.post(`/auth/wishlist/${propertyId}`);
      if (res.data?.success) {
        setUser((prev) =>
          prev ? { ...prev, savedProperties: res.data.savedProperties } : null
        );
        return res.data.isSaved;
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
    return false;
  };

  const isWishlisted = (propertyId: string): boolean => {
    if (user?.savedProperties) {
      return user.savedProperties.includes(propertyId);
    }
    const guestWishlist: string[] = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
    return guestWishlist.includes(propertyId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        toggleWishlist,
        isWishlisted,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
