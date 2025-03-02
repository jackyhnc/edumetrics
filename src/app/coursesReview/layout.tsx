"use client"

import { TUseSession, useSession } from "@/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CoursesReviewLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { userData, handleLogout } = useSession() as TUseSession;

  useEffect(() => {
    if (userData?.role === "student") {
      router.replace("/chatbot");
    }
  }, [userData, router]);

  return (
    <>
      <div className="absolute top-4 right-4 z-[101]">
        <button
          onClick={() => {
            handleLogout()
            router.push("/")
          }}
          className="flex items-center p-2 bg-black border border-purple-800 rounded-md hover:bg-purple-900/30 transition-colors duration-200 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
      {children}
    </>
  );
};

export default CoursesReviewLayout;
