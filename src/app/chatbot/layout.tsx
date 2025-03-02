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
    <aside className="bg-black px-6 w-64 h-screen py-14 space-y-8 fixed bottom-0 border-r border-purple-900/50">
      <div className="">
        <div className="flex mb-6 h-auto w-36 cursor-pointer" id="logo"
          onClick={() => window.location.href = '/'}
        >
          <Image
            src={"/logo_text.svg"}
            alt={"logo_text"}
            width={0}
            height={0}
            className="h-auto w-36 filter brightness-0 invert"
          />
        </div>
        <div className="cursor-pointer hover:bg-purple-900/30 p-2 gap-3 align-items border-purple-800 border rounded-md flex m-auto transition-all duration-200 text-white"
          onClick={() => {
            window.location.href = `/chatbot/${v4()}`
          }}
        >
          <Image
            src={"/logo_icon.svg"}
            alt={"logo_icon"}
            width={0}
            height={0}
            className="size-5 my-auto filter brightness-0 invert"
          />
          <div className="">New Chat</div>
        </div>
      </div>
      <div className="">
        <div className="font-semibold text-purple-400">Chats</div>
        <div className="flex flex-col">
          {data &&
            data.map((chat: any) => {
              return (
                <Link 
                  key={chat.name} 
                  href={`${chat.id}`} 
                  className="cursor-pointer w-full truncate hover:bg-purple-900/30 p-2 rounded-md text-white/80 hover:text-white transition-colors duration-200"
                >
                  {chat.name}
                </Link>
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

  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function hook() {
      setLoading(true)
      if (user && userData) {
        try {
          const res = await getChats({
            id: "1",
            email: user.email!,
            university: userData.university!,
            role: userData.role!,
          });
          console.log(res)
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
        } catch (error) {
          console.error("Error fetching chats:", error);
        } finally {
          setLoading(false)
        }
      } else {
        console.log("no user")
        setLoading(false)
      }
    }
    hook().catch(error => {
      setLoading(false)
      console.error("Error in hook:", error);
    });
  }, [user, userData]);

  useEffect(() => {
    if (userData?.role == "faculty") {
      router.replace("/coursesReview")
    }
  },[])

  return (
    <div className="flex relative bg-black min-h-screen text-white">
      <Sidebar data={data}/>
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
      <div className="w-64 h-screen"></div>
      <main className="flex-1 bg-gradient-to-br from-black to-purple-950">{children}</main>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-purple-700 rounded-full animate-spin-slow"></div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spinSlow 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}