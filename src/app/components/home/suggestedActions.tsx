'use client';

import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Contact, Eye, Pencil } from 'lucide-react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ append, chatId }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Quero te conhecer',
      label: 'Quem é você e com o que você trabalha?',
      action: 'Quem é você e com o que você trabalha?',
      icon: <Eye className="md:!size-5" />
    },
    {
      title: 'Quero te contratar',
      label: 'Como posso entrar em contato com você?',
      action:
        'Como posso entrar em contato com você? Você tem disponibilidade para novos trabalhos?',
      icon: <Contact className="md:!size-5" />
    }
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-2 md:gap-5 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            className="text-left border border-stone-200 rounded-xl px-4 py-3.5 text-sm flex gap-3 md:gap-5 w-full h-auto justify-start items-center text-stone-700 whitespace-normal"
            onClick={async () => {
              //   window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action
              });
            }}
          >
            <div className="rounded-lg bg-stone-800 text-muted p-3 md:p-4">
              {suggestedAction.icon}
            </div>

            <span className="grid">
              <span className="font-medium">{suggestedAction.title}</span>
              {suggestedAction.label && (
                <span className="text-muted-foreground">
                  {suggestedAction.label}
                </span>
              )}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
