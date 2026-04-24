import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth as useClerkAuth, useClerk, useUser } from '@clerk/clerk-react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:5000/api';

const LOCAL_TOKEN_KEY = 'seller_token';

function normalizeLocalUser(user) {
  if (!user) return null;

  const fullName = user.name || user.company || 'Seller';
  const firstName = fullName.split(' ')[0] || 'Seller';

  return {
    id: user.id,
    clerkId: user.clerkId,
    authProvider: 'local',
    fullName,
    firstName,
    primaryEmailAddress: { emailAddress: user.email || '' },
    primaryPhoneNumber: { phoneNumber: user.phone || '' },
    unsafeMetadata: {
      profileCompleted: user.isProfileComplete === true,
      businessName: user.company || '',
      mobile: user.phone || '',
      address: user.address || '',
      website: user.website || '',
      email: user.email || '',
      company: user.company || '',
      phone: user.phone || '',
    },
    rawProfile: user,
  };
}

export function AuthProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useUser();
  const { getToken: getClerkToken } = useClerkAuth();
  const clerk = useClerk();

  const [localToken, setLocalToken] = useState(() => localStorage.getItem(LOCAL_TOKEN_KEY) || '');
  const [localUser, setLocalUser] = useState(null);
  const [localLoaded, setLocalLoaded] = useState(false);
  const [backendUser, setBackendUser] = useState(null);

  const fetchBackendProfile = async (explicitToken) => {
    const token = explicitToken || localToken || await getClerkToken();
    if (!token) return null;

    const res = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data?.user || null;
  };

  const refreshProfile = async (explicitToken) => {
    const profile = await fetchBackendProfile(explicitToken);

    if (localToken || explicitToken) {
      setLocalUser(profile);
    }

    setBackendUser(profile);

    if (!localToken && typeof clerkUser?.reload === 'function') {
      await clerkUser.reload();
    }

    return profile;
  };

  useEffect(() => {
    const bootstrapLocalSession = async () => {
      if (!localToken) {
        setLocalUser(null);
        setLocalLoaded(true);
        return;
      }

      try {
        const profile = await fetchBackendProfile(localToken);
        setLocalUser(profile);
        setBackendUser(profile);
      } catch (error) {
        localStorage.removeItem(LOCAL_TOKEN_KEY);
        setLocalToken('');
        setLocalUser(null);
        setBackendUser(null);
      } finally {
        setLocalLoaded(true);
      }
    };

    bootstrapLocalSession();
  }, [localToken]);

  useEffect(() => {
    const bootstrapClerkProfile = async () => {
      if (!clerkLoaded) return;

      if (!clerkSignedIn) {
        setBackendUser(null);
        return;
      }

      try {
        const profile = await fetchBackendProfile();
        setBackendUser(profile);
      } catch (error) {
        console.error('Failed to fetch backend profile:', error);
      }
    };

    bootstrapClerkProfile();
  }, [clerkLoaded, clerkSignedIn, clerkUser?.id]);

  const loginWithPassword = async ({ email, password }) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const token = res.data?.token || '';

    localStorage.setItem(LOCAL_TOKEN_KEY, token);
    setLocalToken(token);
    const profile = await refreshProfile(token);

    return { ...res.data, user: profile };
  };

  const logout = async () => {
    if (localToken) {
      localStorage.removeItem(LOCAL_TOKEN_KEY);
      setLocalToken('');
      setLocalUser(null);
      setBackendUser(null);
      return;
    }

    if (clerkSignedIn) {
      await clerk.signOut({ redirectUrl: '/' });
    }
  };

  const getToken = async () => {
    if (localToken) return localToken;
    return getClerkToken();
  };

  const authType = localToken && localUser ? 'local' : clerkSignedIn ? 'clerk' : null;
  const user = authType === 'local' ? normalizeLocalUser(localUser) : clerkUser;
  const isSignedIn = Boolean(authType);
  const isLoaded = clerkLoaded && localLoaded;
  const isProfileComplete = backendUser?.isProfileComplete === true ||
    (authType !== 'local' && (
      user?.unsafeMetadata?.profileCompleted === true ||
      (user?.unsafeMetadata?.businessName &&
        user?.unsafeMetadata?.mobile &&
        user?.unsafeMetadata?.address)
    ));

  return (
    <AuthContext.Provider
      value={{
        user,
        backendUser,
        isLoaded,
        isSignedIn,
        isProfileComplete,
        authType,
        getToken,
        logout,
        loginWithPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAppAuth must be used within AuthProvider');
  }
  return context;
}
