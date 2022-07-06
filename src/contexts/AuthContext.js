import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const setUserInDatabase = async (currentUser) => {
    await setDoc(doc(db, "users", currentUser.uid), {
      email: currentUser.email,
    });
  };

  const signup = async (email, password) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    setUserInDatabase(user);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  });

  const value = { signup, login, logout, user, passwordReset };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
