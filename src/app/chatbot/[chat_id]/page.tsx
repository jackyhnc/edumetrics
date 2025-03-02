"use client"

import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdown } from '@/components/memoized-markdown';
import { TUseSession, useSession } from '@/context';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { v4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function ChatbotPage() {
  const router = useRouter();
  const { chat_id } = useParams<{ chat_id: string }>() || { chat_id: '' };
  const { userData, user } = useSession() as TUseSession;

  console.log(chat_id)

  useEffect(() => {
    if (userData?.chats.some(chat => chat.id === chat_id)) {
      router.push(`/chatbot/${v4()}`);
    }
  }, [router, chat_id, userData?.chats]);

  const { messages } = useChat({
    id: 'chat',
    // Throttle the messages and data updates to 50ms:
    experimental_throttle: 50,
  });

  useEffect(() => {
    if (messages.length > 0) {

    const saveChatToFirestore = async () => {
      try {
        const chatDocRef = doc(db, user, "chats", );
        await setDoc(chatDocRef, {
          messages: messages,
          userId: userData?.id, // Assuming userData has an id field
          createdAt: new Date(),
        });
        console.log("Chat saved successfully!");
      } catch (error) {
        console.error("Error saving chat: ", error);
      }
    };

    saveChatToFirestore();
    }
  },[messages])

  return (
    <div className="flex flex-col w-full max-w-3xl px-24 py-14 mx-auto stretch">
      <div className="space-y-8 mb-4">
        {messages.length == 0 &&
          <div className="size-full pt-30 flex justify-center items-center">
            <div className="text-4xl font-bold">What do you want to learn?</div>
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
      <MessageInput />
    </div>
  );
}

const MessageInput = () => {
  const { input, handleSubmit, handleInputChange } = useChat({ id: 'chat' });
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="fixed bottom-0 w-full max-w-xl p-4 mb-8 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-xl bg-white"
        placeholder="Ask me anything"
        value={input}
        onChange={handleInputChange}
      />
    </form>
  );
};