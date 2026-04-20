
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Ebook, SiteConfig } from '../types';
import { firebaseService } from '../services/firebaseService';
import { INITIAL_EBOOKS, DEFAULT_CONFIG } from '../constants';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface FirebaseContextType {
  ebooks: Ebook[];
  config: SiteConfig;
  user: User | null;
  loading: boolean;
  isAuthReady: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    firebaseService.testConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });

    const unsubscribeEbooks = firebaseService.subscribeToEbooks((data) => {
      // We always set ebooks to what's in Firebase. 
      // If it's truly empty, we can show initial books for demo, 
      // but we shouldn't mix them unless we have a clear reason.
      setEbooks(data.length > 0 ? data : INITIAL_EBOOKS);
      setLoading(false);
    });

    const unsubscribeConfig = firebaseService.subscribeToConfig((data) => {
      setConfig(data);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeEbooks();
      unsubscribeConfig();
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ ebooks, config, user, loading, isAuthReady }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
