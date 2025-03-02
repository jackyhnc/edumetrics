"use client"


import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";

const AuthContext = createContext({});

export function useSession() {
  return useContext(AuthContext);
}

export function SessionProvided(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<TUser | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserData(undefined)
      return
    }

    const userDocRef = doc(db, "users", user.email!);

    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      const userSnapData = snapshot.data();
      const userDoc: TUser = {
        chats: userSnapData?.chats,
        role: userSnapData?.role,
        courses: userSnapData?.courses,
      }
      setUserData(userDoc)
    });
    return () => unsubscribe();
  }, [user]);

  const handleSignup = async (email: string, password: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!email || !emailPattern.test(email)) {
      console.log("A valid email is required.");
      return undefined;
    }

    if (!password || !passwordPattern.test(password)) {
      console.log("Password must be at least 8 characters long and include at least one number and one special character.");
      return undefined;
    }

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = response?.user

      const userRef = doc(db, "users", newUser.email!);
      await setDoc(userRef, {
        isOnboarded: false,
      });

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
    <AuthContext.Provider value={{ user, userData, isLoading, handleLogin, handleLogout, handleSignup }}>

      {props.children}
    </AuthContext.Provider>
  )
}

export type TUseSession = {
  user: User | null,
  isLoading: Boolean,
  login: (email: string, password: string) => Promise<UserCredential | undefined>
  signup: (email: string, password: string) => Promise<UserCredential | undefined>
  logout: () => {}
  userData: TUser | null,
}
type TChat = {
  course: string;
  id: string;
  prompts: Array<{
    content: string;
    role: "user" | "assistant";
    time: string;
  }>;
};

export type TUser = {
  chats: TChat[];
  role: "student" | "faculty";
  courses: string[]
};