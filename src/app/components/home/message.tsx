'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import CustomMarkdown from '../CustomMarkdown';
import { Skeleton } from '@/components/ui/skeleton';

function getBrasiliaTime(date?: 'string'): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date || ''));
}

export type MessageProps = {
  agent: 'system' | 'user' | 'assistant' | 'data';
  message?: any;
};

export default function Message(props: MessageProps) {
  const { agent, message } = props;
  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={agent}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'group-data-[role=user]/message:w-fit': true
            }
          )}
        >
          {agent === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background relative overflow-hidden">
              <img
                src="https://media.licdn.com/dms/image/v2/D4D03AQFHN9hXOTem5Q/profile-displayphoto-shrink_800_800/B4DZTS0apXG4Ag-/0/1738703744215?e=1744848000&v=beta&t=iqqgf7xgEFJ2nmcBDGokyGb97OjEGbRrkgqwx4jALdQ"
                alt=""
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row gap-2 items-start">
              <div
                className={cn('flex flex-col gap-4 border', {
                  'bg-green-200 !text-primary px-3 py-2 rounded-xl border-green-300':
                    agent === 'user',
                  'bg-white !text-primary px-3 py-2 rounded-xl border-stone-100':
                    agent === 'assistant'
                })}
              >
                <CustomMarkdown>{message}</CustomMarkdown>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
