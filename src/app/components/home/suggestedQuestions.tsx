'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
    <div className="max-w-3xl mx-auto w-full px-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ delay: 0.5 }}
          className="grid justify-end gap-2 "
        >
          <p className="text-xs text-stone-500 text-right">
            Sugestões de perguntas:
          </p>
          {suggestedQuestions.map((q: string, index: number) => {
            return (
              <div
                key={`${q}_${index}`}
                className="flex flex-row gap-2 items-start justify-end"
              >
                <div
                  className={cn(
                    'flex cursor-pointer flex-col text-sm border !text-primary px-3 pb-2 pt-2.5 rounded-xl shadow-sm duration-300',
                    {
                      'bg-green-100 border-green-200 hover:bg-green-200': true
                    }
                  )}
                  onClick={async () => {
                    //   window.history.replaceState({}, '', `/chat/${chatId}`);

                    append({
                      role: 'user',
                      content: q
                    });
                  }}
                >
                  {q}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
