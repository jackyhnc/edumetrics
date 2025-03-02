"use client"


import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth";
import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { addNewUser, auth, db } from "@/config/firebase";

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

    const userDocRef = query(collection(db, "users"), where("email", "==", user.email!));
    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      const userSnapData = snapshot.docs[0]?.data();
      const userDoc: TUser = {
        chats: userSnapData?.chats ?? ["this doesnt matter "],
        role: userSnapData?.role,
        courses: userSnapData?.courses ?? [],
        university: userSnapData?.university,
      }
      setUserData(userDoc)
    });
    return () => unsubscribe();
  }, [user]);

  const handleSignup = async (email: string, password: string, role: "faculty" | "student", selectedCollege: string) => {
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
      addNewUser({
        university: selectedCollege,
        role: role,
        email: email,
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
  user: User | null;
  isLoading: boolean;
  handleLogin: (email: string, password: string) => Promise<UserCredential | undefined>;
  handleSignup: (email: string, password: string, role: "faculty" | "student", selectedCollege: string) => Promise<UserCredential | undefined>;
  handleLogout: () => Promise<void>;
  userData: TUser | null;
}

export type TChat = {
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
  courses: string[],
  university: string,
};