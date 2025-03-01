'use client';

import { useChat } from '@ai-sdk/react';
import { MemoizedMarkdown } from '@/components/memoized-markdown';

export default async function ChatbotPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params; 
  const chat_id = resolvedParams.slug;

  const { messages } = useChat({
    id: 'chat',
    // Throttle the messages and data updates to 50ms:
    experimental_throttle: 50,
  });

  return (
    <div className="flex flex-col w-full max-w-3xl px-24 py-14 mx-auto stretch">
      <div className="space-y-8 mb-4">
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