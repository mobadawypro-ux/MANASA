import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, testConnection } from '../firebase/config';
import { syncUserProfile } from '../firebase/reportsService';
import { UserRole } from '../types/report';

export const SUPER_ADMIN_EMAIL = 'mobadawypro@gmail.com';

export const isSuperAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
};

export interface GoogleLoginResult {
  success: boolean;
  isAuthorizedAdmin: boolean;
  email?: string;
}

interface AuthContextType {
  role: UserRole;
  user: User | null;
  isAdmin: boolean;
  isGuest: boolean;
  adminDisplayName: string;
  isLoginModalOpen: boolean;
  loginWithGoogle: () => Promise<GoogleLoginResult>;
  loginWithPasscode: (code: string) => boolean;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  role: 'guest',
  user: null,
  isAdmin: false,
  isGuest: true,
  adminDisplayName: 'زائر (وضع القراءة فقط)',
  isLoginModalOpen: false,
  loginWithGoogle: async () => ({ success: false, isAuthorizedAdmin: false }),
  loginWithPasscode: () => false,
  loginAsGuest: () => {},
  logout: async () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
  switchRole: () => {}
});

const ROLE_STORAGE_KEY = 'cement_app_user_role_v3';
const ADMIN_NAME_KEY = 'cement_app_admin_name_v3';
const ADMIN_EMAIL_KEY = 'cement_app_admin_email_v3';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY);
      if (saved === 'admin' || saved === 'guest') {
        return saved;
      }
    } catch (e) {}
    return 'guest';
  });

  const [adminDisplayName, setAdminDisplayName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_NAME_KEY);
      if (saved) return saved;
    } catch (e) {}
    return 'زائر (وضع القراءة فقط)';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Monitor Firebase Auth
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && isSuperAdminEmail(currentUser.email)) {
        setRole('admin');
        const name = currentUser.displayName || currentUser.email || 'م/ محمد بدوي (المسؤول المعتمد)';
        setAdminDisplayName(name);
        try {
          localStorage.setItem(ROLE_STORAGE_KEY, 'admin');
          localStorage.setItem(ADMIN_NAME_KEY, name);
          localStorage.setItem(ADMIN_EMAIL_KEY, currentUser.email || '');
        } catch (e) {}

        syncUserProfile({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        });
      } else {
        // If they are logged in with the passcode, preserve their admin state!
        let savedRole = 'guest';
        try {
          savedRole = localStorage.getItem(ROLE_STORAGE_KEY) || 'guest';
        } catch (e) {}

        if (savedRole === 'admin') {
          setRole('admin');
          const name = 'م/ محمد بدوي (المسؤول المعتمد)';
          setAdminDisplayName(name);
          try {
            localStorage.setItem(ROLE_STORAGE_KEY, 'admin');
            localStorage.setItem(ADMIN_NAME_KEY, name);
          } catch (e) {}
        } else {
          // Any other user or non-signed in visitor is strictly a Guest
          setRole('guest');
          const name = currentUser
            ? `${currentUser.displayName || currentUser.email} (زائر)`
            : 'زائر (وضع القراءة فقط)';
          setAdminDisplayName(name);
          try {
            localStorage.setItem(ROLE_STORAGE_KEY, 'guest');
            localStorage.setItem(ADMIN_NAME_KEY, name);
            if (!currentUser) {
              localStorage.removeItem(ADMIN_EMAIL_KEY);
            }
          } catch (e) {}
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<GoogleLoginResult> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setUser(result.user);
        const email = result.user.email || '';
        if (isSuperAdminEmail(email)) {
          setRole('admin');
          const name = result.user.displayName || email || 'م/ محمد بدوي (المسؤول المعتمد)';
          setAdminDisplayName(name);
          try {
            localStorage.setItem(ROLE_STORAGE_KEY, 'admin');
            localStorage.setItem(ADMIN_NAME_KEY, name);
            localStorage.setItem(ADMIN_EMAIL_KEY, email);
          } catch (e) {}
          setIsLoginModalOpen(false);
          return { success: true, isAuthorizedAdmin: true, email };
        } else {
          // Connected with another Google account -> remain Guest
          setRole('guest');
          const name = `${result.user.displayName || email} (زائر)`;
          setAdminDisplayName(name);
          try {
            localStorage.setItem(ROLE_STORAGE_KEY, 'guest');
            localStorage.setItem(ADMIN_NAME_KEY, name);
            localStorage.removeItem(ADMIN_EMAIL_KEY);
          } catch (e) {}
          return { success: true, isAuthorizedAdmin: false, email };
        }
      }
    } catch (error) {
      console.error('Google Sign-in Error:', error);
    }
    return { success: false, isAuthorizedAdmin: false };
  };

  const loginWithPasscode = (code: string): boolean => {
    const clean = code.trim();
    if (clean === '2026' || clean === 'admin2026' || clean === '1234') {
      setRole('admin');
      const name = 'م/ محمد بدوي (المسؤول المعتمد)';
      setAdminDisplayName(name);
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, 'admin');
        localStorage.setItem(ADMIN_NAME_KEY, name);
      } catch (e) {}
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const loginAsGuest = () => {
    setRole('guest');
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, 'guest');
    } catch (e) {}
    setIsLoginModalOpen(false);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin' && (!user || !isSuperAdminEmail(user.email))) {
      return; // denied: only mobadawypro@gmail.com can be admin
    }
    setRole(newRole);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    } catch (e) {}
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    setRole('guest');
    setAdminDisplayName('زائر (وضع القراءة فقط)');
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, 'guest');
      localStorage.removeItem(ADMIN_NAME_KEY);
      localStorage.removeItem(ADMIN_EMAIL_KEY);
    } catch (e) {}
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const isAdmin = role === 'admin' && !!user && isSuperAdminEmail(user.email);
  const isGuest = !isAdmin;

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAdmin,
        isGuest,
        adminDisplayName,
        isLoginModalOpen,
        loginWithGoogle,
        loginWithPasscode,
        loginAsGuest,
        logout,
        openLoginModal,
        closeLoginModal,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
