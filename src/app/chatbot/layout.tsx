"use client"
import { TUseSession, useSession } from '@/context';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { v4 } from 'uuid';

const data = [
  {
    name: "derivative",
    course: "math",
    id: 123123,
    prompts: [
      {
        content: "hi",
        role: "user",
        time: 1,
      },
      {
        content: "hey",
        role: "assistant",
        time: 2,
      }
    ]
  },
  {
    name: "shaekspesare",
    course: "english",
    id: 4512,
    prompts: [
      {
        content: "hi",
        role: "user",
        time: 1,
      },
      {
        content: "hey",
        role: "assistant",
        time: 2,
      }
    ]
  }
]


const Sidebar = () => {
  return (
    <aside className="bg-gray-100 px-6 w-64 h-screen py-14 space-y-8 fixed bottom-0">
      <div className="">
        <div className="flex mb-6 h-auto w-36 cursor-pointer" id="logo"
          onClick={() => window.location.href = '/'}
        >
          <Image
            src={"/logo_text.svg"}
            alt={"logo_text"}
            width={0}
            height={0}
            className="h-auto w-36"
          />
        </div>
        <div className="cursor-pointer hover:bg-gray-200 p-2 gap-3 align-items border-zinc-300 border-1 rounded-md flex m-auto"
          onClick={() => {
            window.location.href = `/chatbot/${v4()}`
          }}
        >
          <Image
            src={"/logo_icon.svg"}
            alt={"logo_icon"}
            width={0}
            height={0}
            className="size-5 my-auto"
          />
          <div className="">New Chat</div>
        </div>
      </div>
      <div className="">
        <div className="font-semibold">Chats</div>
        <div className="flex flex-col">
          {
            data.map((chat) => {
              return (
                <Link key={chat.name} href={`${chat.id}`} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">{chat.name}</Link>
              )
            })
          }
        </div>
      </div>
    </aside>
  );
};

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  const { userData, user } = useSession() as TUseSession
  const router = useRouter()
  console.log(userData)
  console.log(user)

  useEffect(() => {
    if (userData?.role == "student") {
      router.replace("/chatbot")
    } else if (userData?.role == "faculty") {
      router.replace("/courseReview")
    } else if (!user || !userData) {
      router.replace("/signup")
    }
  },[])

  return (
    <div className="flex relative">
      <Sidebar />
      <div className="w-64 h-screen"></div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
