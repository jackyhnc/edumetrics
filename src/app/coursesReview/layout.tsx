"use client"

import { TUseSession, useSession } from "@/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CoursesReviewLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { userData } = useSession() as TUseSession;

  useEffect(() => {
    if (userData?.role === "student") {
      router.replace("/chatbot");
    }
  }, [userData, router]);

  return (
    <>
      {children}
    </>
  );
};

export default CoursesReviewLayout;
