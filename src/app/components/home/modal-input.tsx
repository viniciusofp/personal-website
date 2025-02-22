'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn, sanitizeUIMessages } from '@/lib/utils';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { LoaderCircle, SendIcon, SquareIcon } from 'lucide-react';
import { Ref, useRef } from 'react';
import { ChangeEventHandler } from 'react';
import { SuggestedActions } from './suggestedActions';

export type ModalInputProps = {
  input: string;
  handleInputChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  messages: any;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  chatId: string;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  stop: () => void;
};

export default function ModalInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  messages,
  append,
  chatId,
  stop,
  setMessages
}: ModalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && (
        <SuggestedActions append={append} chatId={chatId} />
      )}
      <Textarea
        placeholder="Como posso te ajudar?"
        value={input}
        onChange={handleInputChange}
        className={cn(
          'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700'
        )}
        rows={2}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
          }
        }}
      />
      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
        {isLoading ? (
          <Button
            size="icon"
            className="rounded-full flex items-center justify-center"
          >
            <LoaderCircle className="w-8 h-8 text-white animate-spin duration-[2s]" />
          </Button>
        ) : (
          <Button
            size="icon"
            className="rounded-full flex items-center justify-center"
            type="submit"
            // input={input}
            // submitForm={submitForm}
            // uploadQueue={uploadQueue}
          >
            <SendIcon className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
