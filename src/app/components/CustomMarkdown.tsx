'use client';

import { ArrowUpRight } from 'lucide-react';
import Markdown from 'react-markdown';

export type CustomMarkdownProps = { children: string };

export default function CustomMarkdown({ children }: CustomMarkdownProps) {
  return (
    <Markdown
      className={'prose text-inherit'}
      components={{
        a: (props) => (
          <a href={props.href} target="_blank" className="text-blue-500">
            {props.children}{' '}
            <ArrowUpRight className="w-3 h-3 inline relative -top-1" />
          </a>
        )
      }}
    >
      {children}
    </Markdown>
  );
}
