"use client"

import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdown } from '@/components/memoized-markdown';
import { TUseSession, useSession } from '@/context';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { generateObject } from 'ai';
import { z } from 'zod';
import { CoursesSelection } from '@/components/coursesSelection';

export default function ChatbotPage() {
  const router = useRouter();
  const { chat_id } = useParams<{ chat_id: string }>() || { chat_id: '' };
  const { userData, user } = useSession() as TUseSession;
  const data = ["engl", "math", "physics"]

  const [choosingCourse, setChoosingCourse] = useState("")
  const [course, setCourse] = useState("")

  useEffect(() => {
    if (userData?.chats.some(chat => chat.id === chat_id)) {
      router.push(`/chatbot/${v4()}`);
    }
  }, [router, chat_id, userData?.chats]);

  const { messages, status } = useChat({
    id: 'chat',
    // Throttle the messages and data updates to 50ms:
    experimental_throttle: 50,
    async onFinish(message) {
      if (messages.length === 1 || messages.length % 5 === 0) {
        return
      }
      
      const { object } = await generateObject({
        model: openai("4o-mini"),
        schema: z.object({
          subjects: z.array(z.string()),
        }),
        prompt: `Output a list of subjects from ${userData?.courses} that is from the users prompt: ${message}`
      });
      console.log("-----------")
      console.log(object)
    }
  });

  useEffect(() => {
    if (messages.length > 0) {
      try {
        /*
        const chatDoc = doc(db, "users", user?.email, "chats", chat_id);

        const newChatDoc = {
          ...chatDoc,

        }
        
        await setDoc(chatDoc, {
          messages: messages,
          userId: userData?.id, // Assuming userData has an id field
          createdAt: new Date(),
        });
        console.log("Chat saved successfully!");
        */
       //for bylan leo danis
      } catch (error) {
        console.error("Error saving chat: ", error);
      }
    }
  },[messages])

  return (
    <div className="flex flex-col w-full max-w-3xl px-24 py-14 mx-auto stretch">
      {
        course.length > 0 ?
        <>
          <div className="space-y-8 mb-4">
            {messages.length == 0 &&
              <div className="size-full pt-30 flex justify-center items-center flex-col space-y-2">
                <div className="text-4xl font-bold">What do you want to learn?</div>
                <div className="text-gray-600">{course}</div>
              </div>
            }
            {messages.map(message => (
              <div key={message.id}>
                <div className="prose space-y-2">
                  {message.role === 'user' ? 
                    <div className="w-full flex justify-end">
                      <div className="bg-gray-100 text-right p-3 rounded-xl w-fit">{message.content}</div>
                    </div>
                    : 
                    <MemoizedMarkdown id={message.id} content={message.content} />
                  }
                </div>
              </div>
            ))}
          </div>
          <MessageInput isDisabled={status === 'streaming'} course={course}/>
        </> :
        <>
          <div className="space-y-8 mb-4 flex justify-center flex-col">
            <div className="size-full pt-30 flex justify-center items-center">
              <div className="text-4xl font-bold text-center">Which course do you need help on?</div>
            </div>
            <div className="flex justify-center gap-2">
              {data.map((d) => {
                if (choosingCourse === d) {
                  return (
                    <div id='d' 
                    className="rounded-md p-2 bg-gray-700 hover:cursor-pointer text-white"
                    onClick={() => setChoosingCourse(d)}
                  >{d}</div>
                  )
                } else {
                  return (
                    <div id='d' 
                      className="rounded-md p-2 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer"
                      onClick={() => setChoosingCourse(d)}
                    >{d}</div>
                  )
                }
              })}
            </div>
            <button 
              onClick={() => setCourse(choosingCourse)} 
              className="bg-black text-white p-3 px-8 cursor-pointer rounded-md mt-24"
            >
              Create Chat
            </button>
          </div>
        </>
      }
    </div>
  );
}

const MessageInput = ({ isDisabled }: { isDisabled: boolean, course: any } ) => {
  const { input, handleSubmit, handleInputChange } = useChat({ id: 'chat' });
  return (
    <form onSubmit={handleSubmit}>
    <input
      className="fixed bottom-0 w-full max-w-xl p-4 mb-8 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-xl bg-white"
      placeholder="Ask me anything"
      value={input}
      onChange={handleInputChange}
      disabled={isDisabled} 
    />
    </form>
  );
}