"use client"
import { getChats } from '@/config/firebase';
import { TUseSession, useSession } from '@/context';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

const Sidebar = ({data}:any) => {
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
          {data &&
            data.map((chat: any) => {
              return (
                <Link key={chat.name} href={`${chat.id}`} className="cursor-pointer w-full truncate hover:bg-gray-200 p-2 rounded-md">{chat.name}</Link>
              )
            })
          }
        </div>
      </div>
    </aside>
  );
};

export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  const { userData, user, handleLogout } = useSession() as TUseSession
  const router = useRouter()
  console.log(userData)
  console.log(user)

  const [data,setData] = useState<any>()

  useEffect(() => {
    async function hook() {
      if (user && userData) {
        const res = await getChats({
          id: "1",
          email: user.email!,
          university: userData.university!,
          role: userData.role!,
        });
        if (res) {
          const data = res.map(r => {
            return {
              name: r.name,
              id: r.id,
            }
          })
          setData(data)
        } else {
          console.error("Failed to retrieve chat data.");
        }
      } else {
        console.log("no user")
      }
    }
    hook().catch(error => {
      console.error("Error in hook:", error);
    });
  }, [user, userData]);

  useEffect(() => {
    if (userData?.role == "faculty") {
      router.replace("/courseReview")
    }
  },[])

  return (
    <div className="flex relative">
      <Sidebar data={data}/>
      <div className="absolute top-2 right-4 z-[101]">
        <button 
          onClick={() => {
            handleLogout()
            router.push("/")
          }} 
          className="flex items-center p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <i className="fas fa-sign-out-alt text-xl hover:cursor-pointer"></i>
        </button>
      </div>
      <div className="w-64 h-screen"></div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
