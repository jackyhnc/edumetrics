"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export default function DefaultChatbot() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.push(`chatbot/${uuidv4()}`);
    }, 1000); // Adjust the interval as needed
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <i className="fas fa-spinner fa-spin text-3xl"></i>
      <div className="ml-4">Creating a new chat for you</div>
    </div>
  )
}