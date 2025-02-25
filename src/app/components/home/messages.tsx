'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useScrollToBottom } from '../use-scroll-to-bottom';
import Message from './message';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import React from 'react';
import { Overview } from './overview';
const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export type MessagesProps = {
  messages: any[];
  isLoading: boolean;
};

export default function Messages({ messages, isLoading }: MessagesProps) {
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
            className="w-full mx-auto max-w-3xl px-4 group/message"
          >
            <div className="h-0.5 w-24 bg-stone-500 mx-auto rounded-sm"></div>
          </motion.div>
        </AnimatePresence>
      )}
      {messages.map((m, index) => {
        return (
          <React.Fragment key={`message_${index}`}>
            {m.parts.map((part: any) => {
              if (part.type === 'text') {
                const relatedProjects = m.toolInvocations?.filter(
                  (t: any) => t.toolName === 'getInformation'
                )[0]?.result.posts;
                return (
                  <React.Fragment key={m.id}>
                    <Message agent={m.role} message={part.text} />
                    {!!relatedProjects &&
                      !isLoading &&
                      m.id === messages[messages.length - 1].id && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ delay: 0.5 }}
                            className="w-full mx-auto max-w-3xl px-16"
                          >
                            <p className="text-blue-700 text-sm mb-3 border-l-2 pl-3 border-blue-700">
                              Projetos que podem te interessar
                            </p>
                            <Carousel
                              className="w-full"
                              opts={{
                                align: 'start',
                                loop: true
                              }}
                            >
                              <CarouselContent className="w-full">
                                {relatedProjects.map((proj: any) => {
                                  const postImageUrl =
                                    proj.media.length > 0
                                      ? urlFor(proj.media[0])
                                          ?.width(550)
                                          .height(310)
                                          .url()
                                      : null;
                                  console.log(proj);
                                  return (
                                    <CarouselItem
                                      key={`${proj._id}_${m.id}`}
                                      className="lg:basis-1/2"
                                    >
                                      <div className="border p-2 rounded-lg flex items-center cursor-pointer hover:bg-stone-100 duration-200">
                                        {postImageUrl && (
                                          <div className="aspect-square rounded bg-black w-24 shrink-0 overflow-hidden relative">
                                            <img
                                              src={postImageUrl}
                                              alt=""
                                              className="w-full h-full object-cover object-center"
                                            />
                                          </div>
                                        )}

                                        <div className="pl-5">
                                          <h2 className="font-bold">
                                            {proj.title}
                                          </h2>
                                          <h3 className="text-sm text-stone-500 font-medium mb-1">
                                            {proj.label}
                                          </h3>
                                        </div>
                                      </div>
                                    </CarouselItem>
                                  );
                                })}
                              </CarouselContent>
                              <CarouselPrevious />
                              <CarouselNext />
                            </Carousel>
                            {/* 
                        {JSON.stringify(relatedProjects)} */}
                          </motion.div>
                        </AnimatePresence>
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
