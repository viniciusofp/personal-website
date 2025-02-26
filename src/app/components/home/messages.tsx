'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useScrollToBottom } from '../use-scroll-to-bottom';
import Message from './message';

import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { ChatRequestOptions, CreateMessage, Message as MessageAI } from 'ai';
import React from 'react';
import { Overview } from './overview';
import SuggestedProjects from './suggestedProjects';
import SuggestedQuestions from './suggestedQuestions';
const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export type MessagesProps = {
  messages: any[];
  isLoading: boolean;
  append: (
    message: MessageAI | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
};

export default function Messages({
  messages,
  isLoading,
  append
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {true && <Overview />}
      {messages.length > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full mx-auto max-w-3xl px-4 group/message mt-2 mb-8"
          >
            <div className="h-0.5 w-24 bg-stone-200 mx-auto rounded-sm border-stone-300"></div>
          </motion.div>
        </AnimatePresence>
      )}
      {messages.map((m, index) => {
        return (
          <React.Fragment key={`message_${index}`}>
            {m.parts.map((part: any) => {
              if (part.type === 'text') {
                const suggestedQuestions = m.toolInvocations?.filter(
                  (t: any) => t.toolName === 'getInformation'
                )[0]?.result.suggestedQuestions;
                const relatedWork: { _ref: string }[] =
                  m.toolInvocations?.filter(
                    (t: any) => t.toolName === 'getInformation'
                  )[0]?.result.relatedWork;
                return (
                  <React.Fragment key={m.id}>
                    <Message agent={m.role} message={part.text} />
                    {!!relatedWork &&
                      !isLoading &&
                      m.id === messages[messages.length - 1].id && (
                        <SuggestedProjects relatedWork={relatedWork} />
                      )}
                    {!!suggestedQuestions &&
                      !isLoading &&
                      m.id === messages[messages.length - 1].id && (
                        <SuggestedQuestions
                          suggestedQuestions={suggestedQuestions}
                          append={append}
                        />
                      )}
                  </React.Fragment>
                );
              }
            })}
          </React.Fragment>
        );
      })}
      {isLoading && (
        <AnimatePresence>
          <motion.div className="w-full mx-auto max-w-3xl px-4 animate-pulse text-stone-500">
            Pensando...
          </motion.div>
        </AnimatePresence>
      )}
      {/* <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message "
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
        data-role={'assistant'}
      >
        <div
          className={cn(
            'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
            {
              'group-data-[role=user]/message:bg-muted': true
            }
          )}
        >
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <SparklesIcon className="w-10 h-10" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-4 text-muted-foreground">
              Thinking...
            </div>
          </div>
        </div>
      </motion.div> */}
      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}
