'use client';
import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';
import { SparkleIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import Messages from './messages';
import ModalInput from './modal-input';

export type ChatProps = {};

export default function Chat(props: ChatProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    id,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    append,
    setMessages,
    isLoading,
    error
  } = useChat();
  console.log(error);
  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      {/* <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
        <Button
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto"
          asChild
        >
          <Link
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET,OPENAI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&stores=%5B%7B%22type%22:%22postgres%22%7D,%7B%22type%22:%22blob%22%7D%5D"
            target="_noblank"
          >
            <SparkleIcon size={16} />
            Deploy with Vercel
          </Link>
        </Button>
      </header> */}
      <Messages messages={messages} isLoading={isLoading} append={append} />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
      >
        <ModalInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          messages={messages}
          append={append}
          chatId={id}
          stop={stop}
          setMessages={setMessages}
        />
      </form>
    </div>
  );
}
