
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Ebook, SiteConfig } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const firebaseService = {
  // Ebooks
  subscribeToEbooks: (callback: (ebooks: Ebook[]) => void) => {
    const q = query(collection(db, 'ebooks'));
    return onSnapshot(q, (snapshot) => {
      const ebooks = snapshot.docs.map(doc => ({ ...doc.data() } as Ebook));
      callback(ebooks);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'ebooks');
    });
  },

  saveEbook: async (ebook: Ebook) => {
    try {
      await setDoc(doc(db, 'ebooks', ebook.id), ebook);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `ebooks/${ebook.id}`);
    }
  },

  deleteEbook: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ebooks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `ebooks/${id}`);
    }
  },

  // Config
  subscribeToConfig: (callback: (config: SiteConfig) => void) => {
    return onSnapshot(doc(db, 'config', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as SiteConfig);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'config/main');
    });
  },

  saveConfig: async (config: SiteConfig) => {
    try {
      await setDoc(doc(db, 'config', 'main'), config);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/main');
    }
  },

  // Test Connection
  testConnection: async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }
};
