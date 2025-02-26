'use client';

import { Button } from '@/components/ui/button';
import { Message, CreateMessage, ChatRequestOptions } from 'ai';
import { AnimatePresence, motion } from 'motion/react';

export type SuggestedQuestionsProps = {
  suggestedQuestions: string[];
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
};

export default function SuggestedQuestions({
  suggestedQuestions,
  append
}: SuggestedQuestionsProps) {
  return (
    <div className="max-w-3xl mx-auto w-full px-16">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-2 gap-5 "
        >
          {suggestedQuestions.map((q: string, index: number) => {
            return (
              <Button
                key={`${q}_${index}`}
                variant="ghost"
                className="text-left border border-stone-200 rounded-xl px-4 py-3.5 text-sm flex gap-3 w-full h-auto justify-start items-center text-stone-700 whitespace-normal"
                onClick={async () => {
                  //   window.history.replaceState({}, '', `/chat/${chatId}`);

                  append({
                    role: 'user',
                    content: q
                  });
                }}
              >
                {q}
              </Button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
