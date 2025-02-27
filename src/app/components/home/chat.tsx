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
  return (
    <div className="flex flex-col min-w-0 h-dvh">
      {/* <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
        <Button
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto"
          asChild
        >
          <Link href="/training">
            <SparkleIcon size={16} />
            Deploy with Vercel
          </Link>
        </Button>
      </header> */}
      <Messages messages={messages} isLoading={isLoading} append={append} />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
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
