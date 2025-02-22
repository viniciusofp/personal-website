'use client';

import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

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
      title: 'Com o que você trabalha?',
      action: 'Com o que você trabalha?'
    },
    {
      title: `Me conte sobre você.`,
      action: `Me conte sobre você.`
    },
    {
      title: 'Você tem disponibilidade',
      label: `para aceitar novos trabalhos?`,
      action: `Você tem disponibilidade para aceitar novos trabalhos?`
    },
    {
      title: 'Quero te contratar',
      label: 'Como posso entrar em contato com você?',
      action: 'Como posso entrar em contato com você?'
    }
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
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
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-0 sm:flex-col w-full h-auto justify-start items-start"
            onClick={async () => {
              //   window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action
              });
            }}
          >
            <span className="font-medium">{suggestedAction.title}</span>
            {suggestedAction.label && (
              <span className="text-muted-foreground">
                {suggestedAction.label}
              </span>
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
