'use client';

import { cn, formatTimeHHmm } from '@/lib/utils';
import { ArrowUpRight, Ellipsis, UserIcon } from 'lucide-react';
import { AnimatePresence, m, motion } from 'motion/react';
import CustomMarkdown from '../CustomMarkdown';
import { Skeleton } from '@/components/ui/skeleton';
import SuggestedProjects from './suggestedProjects';

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
  text: string;
  isLoading: boolean;
  isCurrent: boolean;
};

export default function Message(props: MessageProps) {
  const { agent, message, text, isLoading, isCurrent } = props;

  const relatedWork: { _ref: string }[] = message.toolInvocations?.filter(
    (t: any) => t.toolName === 'getInformation'
  )[0]?.result.relatedWork;
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
            'flex gap-3 md:gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
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

          <div className="flex flex-col gap-5 w-full">
            <div className="grid gap-1.5 items-center">
              <div
                className={cn(
                  'flex flex-col gap-1 border !text-primary px-3.5 py-2.5 rounded-xl shadow-sm',
                  {
                    'bg-green-100 border-green-200': agent === 'user',
                    'bg-white border-stone-200': agent === 'assistant'
                  }
                )}
              >
                <CustomMarkdown>{text}</CustomMarkdown>

                {((!!relatedWork && !isLoading && isCurrent) || !isCurrent) &&
                  relatedWork?.length > 0 && (
                    <SuggestedProjects relatedWork={relatedWork} />
                  )}
              </div>
              {!isCurrent || !isLoading ? (
                <AnimatePresence>
                  <motion.p
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[10px] text-stone-500 text-right flex items-end gap-1 justify-end"
                  >
                    <span className="text-sm leading-none text-lime-600 relative top-[-1px]">
                      ●
                    </span>
                    <span className="strong text-stone-700 font-bold">
                      {agent === 'user' ? 'Você' : 'Vinícius'}
                    </span>{' '}
                    <span>{formatTimeHHmm(message.createdAt)} </span>
                  </motion.p>
                </AnimatePresence>
              ) : (
                <AnimatePresence>
                  <motion.p
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[10px] text-stone-500 text-right flex items-center gap-1 justify-end"
                  >
                    <Ellipsis className="size-3 text-stone-500 animate-pulse justify-self-end" />
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
          </div>

          {agent === 'user' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-stone-800 to-sky-900 relative overflow-hidden">
              <UserIcon className="size-4  text-white" />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
