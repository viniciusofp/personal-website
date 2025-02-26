'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn, sanitizeUIMessages } from '@/lib/utils';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { LoaderCircle, SendIcon, SquareIcon } from 'lucide-react';
import { Ref, useRef } from 'react';
import { ChangeEventHandler } from 'react';
import { SuggestedActions } from './suggestedActions';
import React from 'react';

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
    <div className="grid gap-3 md:gap-5 lg:pb-8 w-full">
      {messages.length === 0 && (
        <SuggestedActions append={append} chatId={chatId} />
      )}
      <div className="relative w-full flex flex-col gap-4">
        <Textarea
          placeholder="Como posso te ajudar?"
          value={input}
          onChange={handleInputChange}
          className={cn(
            'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none !text-base bg-muted dark:border-zinc-700 rounded-full px-4 py-3'
          )}
          rows={1}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 right-2 w-fit flex flex-row justify-end">
          {isLoading ? (
            <Button
              size="icon"
              className="rounded-full flex items-center justify-center bg-stone-800"
            >
              <LoaderCircle className="w-8 h-8 text-white animate-spin duration-[2s]" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="rounded-full flex items-center justify-center bg-stone-800"
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
    </div>
  );
}
