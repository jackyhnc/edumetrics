"use client"

import { TUseSession, useSession } from "@/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userData, user } = useSession() as TUseSession;

  useEffect(() => {
    if (userData?.role === "faculty") {
      router.replace("/courseReview");
    } else if (userData?.role === "student") {
      router.replace("/chatbot");
    }
  }, [userData, router]);

  return (
    <>
      {children}
    </>
  );
}