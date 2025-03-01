
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

const AuthContext = createContext({});


export function useSession() {
  return useContext(AuthContext);
}

export function SessionProvided(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignup = async (email: string, password: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      console.log("A valid email is required.");
      return undefined;
    }

    if (!password || password.length < 8 || !/[A-Za-z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      console.log("Password must be at least 8 characters long and include at least one letter and one special character.");
      return undefined;
    }

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      return response?.user;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return response?.user
    } catch (error) {
      console.log(error);
      return undefined
    }
  }

  const handleLogout = async () => {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, handleLogin, handleLogout }}>
      {props.children}
    </AuthContext.Provider>
  )
}