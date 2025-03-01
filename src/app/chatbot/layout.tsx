import Image from 'next/image';
import Link from 'next/link';

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
    <aside className="bg-gray-100 px-6 w-64 h-screen py-14 space-y-8">
      <div className="">
        <div className="flex mb-4 " id="logo">
          <Image
            src={"logo_text.svg"}
            alt={"logo_text"}
            width={0}
            height={0}
            className="h-auto w-36"
          />
        </div>
        <div className="cursor-pointer hover:bg-gray-200 p-2 gap-3 align-items border-zinc-300 border-1 rounded-md flex m-auto">
          <Image
            src={"logo_icon.svg"}
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
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
