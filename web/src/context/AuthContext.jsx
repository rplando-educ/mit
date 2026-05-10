import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        setUserProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function register({ firstName, lastName, email, password }) {
    const fullName = `${firstName} ${lastName}`.trim();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: fullName });
    const profile = {
      firstName,
      lastName,
      fullName,
      email,
      profilePicture: '',
      role: 'User',
      dateCreated: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', credential.user.uid), profile);
    setUserProfile({ id: credential.user.uid, ...profile });
    return credential.user;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function updateUserProfile(updates) {
    if (!currentUser) return;
    if (updates.fullName) {
      await updateProfile(currentUser, { displayName: updates.fullName });
    }
    await updateDoc(doc(db, 'users', currentUser.uid), updates);
    setUserProfile((profile) => ({ ...profile, ...updates }));
  }

  const value = useMemo(
    () => ({ currentUser, userProfile, loading, register, login, logout, forgotPassword, updateUserProfile }),
    [currentUser, userProfile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
