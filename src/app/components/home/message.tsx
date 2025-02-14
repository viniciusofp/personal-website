'use client';

import { cn } from '@/lib/utils';
import { UserIcon } from 'lucide-react';

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
  children: React.ReactNode;
  agent: 'system' | 'user' | 'assistant' | 'data';
  message?: any;
};

export default function Message(props: MessageProps) {
  const { children, agent, message } = props;
  return (
    <div
      className={cn(
        'flex gap-3 items-end',
        agent === 'assistant' ? 'justify-self-start' : 'justify-self-end'
      )}
    >
      {agent === 'assistant' && (
        <img
          src="https://media.licdn.com/dms/image/v2/D4D03AQFHN9hXOTem5Q/profile-displayphoto-shrink_800_800/B4DZTS0apXG4Ag-/0/1738703744215?e=1744848000&v=beta&t=iqqgf7xgEFJ2nmcBDGokyGb97OjEGbRrkgqwx4jALdQ"
          alt=""
          className="rounded-full w-12 h-12 shadow border-2"
        />
      )}

      <div
        className={cn(
          'px-5 pt-2 pb-3.5 [&>p]:z-10 border  shadow rounded-lg max-w-full text-sm text-stone-600 grid gap-3 relative',
          agent === 'assistant'
            ? ' rounded-bl-none bg-white'
            : ' rounded-br-none bg-green-200 border-green-300'
        )}
      >
        <div
          className={cn(
            'absolute text-[9px] text-stone-500 bottom-0',
            agent === 'assistant' ? 'right-2' : 'left-2'
          )}
        >
          {message && getBrasiliaTime(message.createdAt)}
        </div>
        <div
          className={cn(
            `w-0 h-0 border-l-[8px] border-l-transparent
border-b-[12px] border-r-[8px] border-r-transparent absolute -bottom-[1px] z-0`,
            agent === 'assistant'
              ? ' -left-2 border-b-white'
              : ' -right-2 border-b-green-200'
          )}
        ></div>
        {children}
      </div>
      {agent === 'user' && (
        <div className="rounded-full w-12 h-12 flex items-center justify-center shadow border-2 bg-slate-100">
          <UserIcon className="w-7 h-7 text-slate-600" />
        </div>
      )}
    </div>
  );
}
