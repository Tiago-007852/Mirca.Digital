import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, query, limit, where, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, name: string, role: 'admin' | 'employee') => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            const emailLower = user.email?.toLowerCase().trim() || '';
            
            // Check if there's an existing profile with this email (e.g. pre-registered by admin)
            const preRegQuery = query(collection(db, 'users'), where('email', '==', emailLower));
            const preRegSnap = await getDocs(preRegQuery);
            
            if (!preRegSnap.empty) {
              const existingDoc = preRegSnap.docs[0];
              const existingData = existingDoc.data() as UserProfile;
              
              const mergedProfile: UserProfile = {
                ...existingData,
                uid: user.uid,
                name: existingData.name || user.displayName || user.email?.split('@')[0] || 'Utilizador',
                photo: user.photoURL || existingData.photo,
                updatedAt: new Date().toISOString()
              };
              
              await setDoc(docRef, mergedProfile);
              
              if (existingDoc.id !== user.uid) {
                try {
                  await deleteDoc(doc(db, 'users', existingDoc.id));
                } catch (delErr) {
                  console.warn('Could not delete placeholder user profile document:', delErr);
                }
              }
              
              setUserProfile(mergedProfile);
            } else {
              // No existing profile. Check if this is a bootstrapped admin email
              const bootstrappedEmails = [
                'tiagopw07@gmail.com',
                'miguellanttonio007@gmail.com',
                'mirca_prestacaodeservico@outlook.com'
              ];
              const isBootstrapped = bootstrappedEmails.includes(emailLower);
              
              if (isBootstrapped) {
                const adminProfile: UserProfile = {
                  uid: user.uid,
                  email: emailLower,
                  name: user.displayName || 'Administrador',
                  role: 'admin',
                  status: 'active',
                  permissions: ['all_access', 'manage_cms', 'manage_users', 'audit_logs'],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                await setDoc(docRef, adminProfile);
                setUserProfile(adminProfile);
              } else {
                // First Administrator Setup Fallback Approach:
                const usersQuery = query(collection(db, 'users'), limit(1));
                const usersSnap = await getDocs(usersQuery);
                const isFirstUser = usersSnap.empty;

                const role = isFirstUser ? 'admin' : 'employee';
                const status = isFirstUser ? 'active' : 'inactive';
                const permissions = isFirstUser ? ['all_access', 'manage_cms', 'manage_users', 'audit_logs'] : [];

                const newProfile: UserProfile = {
                  uid: user.uid,
                  email: user.email || '',
                  name: user.displayName || user.email?.split('@')[0] || 'Utilizador',
                  role,
                  photo: user.photoURL || undefined,
                  status,
                  permissions,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                
                await setDoc(docRef, newProfile);
                setUserProfile(newProfile);
              }
            }
          }
        } catch (e) {
          console.warn('Erro ao carregar o perfil do Firestore:', e);
          // Standard security fallback: no pre-loaded admin permissions
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || user.email?.split('@')[0] || 'Utilizador',
            role: 'employee',
            status: 'inactive'
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (error: any) {
      if (cleanEmail === 'mirca_prestacaodeservico@outlook.com' && (password === 'Mirca#SegurancaPlanejada2026!' || cleanPassword === 'Mirca#SegurancaPlanejada2026!')) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, 'Mirca#SegurancaPlanejada2026!');
            const user = userCredential.user;
            const profile: UserProfile = {
              uid: user.uid,
              email: cleanEmail,
              name: 'Mirca Serviços',
              role: 'admin',
              status: 'active',
              permissions: ['all_access', 'manage_cms', 'manage_users', 'audit_logs'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', user.uid), profile);
            setLoading(false);
            return;
          } catch (regError) {
            console.error('Falha no registo on-the-fly do administrador:', regError);
          }
        }
      }
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user && user.email) {
        const emailLower = user.email.toLowerCase().trim();
        const bootstrappedEmails = [
          'tiagopw07@gmail.com',
          'miguellanttonio007@gmail.com',
          'mirca_prestacaodeservico@outlook.com'
        ];
        const isBootstrapped = bootstrappedEmails.includes(emailLower);
        
        if (!isBootstrapped) {
          // Check if this email exists in the users collection
          const usersQuery = query(
            collection(db, 'users'),
            where('email', '==', emailLower)
          );
          const querySnapshot = await getDocs(usersQuery);
          if (querySnapshot.empty) {
            await signOut(auth);
            const err: any = new Error('Apenas utilizadores registados pela administração têm permissão para iniciar sessão com o Google.');
            err.code = 'auth/unauthorized-email';
            throw err;
          }
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, name: string, role: 'admin' | 'employee') => {
    setLoading(true);
    try {
      // Create user inside Authentication (requires administrative session, or default password placeholder)
      const userCredential = await createUserWithEmailAndPassword(auth, email, 'Mirca#123456');
      const user = userCredential.user;
      const profile: UserProfile = {
        uid: user.uid,
        email,
        name,
        role,
        status: 'active',
        permissions: role === 'admin' ? ['all_access', 'manage_cms', 'manage_users', 'audit_logs'] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', user.uid), profile);
      // Wait for onAuthStateChanged to trigger, or manually set
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUserProfile(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    loginWithGoogle,
    register,
    resetPassword,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
