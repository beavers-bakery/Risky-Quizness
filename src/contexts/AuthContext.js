import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const setUserInDatabase = async (currentUser) => {
    await setDoc(doc(db, "users", currentUser.uid), {
      email: currentUser.email,
      username: currentUser.displayName,
    });
  };

  const signup = async (email, password, username) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(auth.currentUser, {
      displayName: username,
    });

    await setUserInDatabase(user);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const passwordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const editProfile = async (displayNameChange, emailChange) => {
    await updateEmail(auth.currentUser, emailChange);

    await updateProfile(auth.currentUser, {
      displayName: displayNameChange,
    });

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      email: auth.currentUser.email,
      username: displayNameChange,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  });

  const value = { signup, login, logout, user, passwordReset, editProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
