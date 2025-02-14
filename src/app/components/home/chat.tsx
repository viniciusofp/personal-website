'use client';
import { useChat } from '@ai-sdk/react';
import Message from './message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight } from 'lucide-react';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export type ChatProps = {};

export default function Chat(props: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <ScrollArea className="max-h-[80svh] w-full max-w-md mx-auto bg-black/10 px-5 rounded-xl border border-black/15">
      <div className="grid gap-5 mx-auto pb-12 pt-5">
        <Message agent="assistant">
          <p>
            Sou <b>desenvolvedor full-stack</b> formado em comunicação social e
            costumo dizer que gosto de trabalhar transformando dados, pesquisas
            e informações em produtos que sejam interessantes e compreendidos
            pelo público. Você pode saber mais sobre minha formação e
            experiência profissional no{' '}
            <b className="underline inline-flex items-center">
              Linkedin <ArrowUpRight className="w-3.5 h-3.5" />
            </b>
            .
          </p>
          <p>
            Desenvolvi esse site para quem tenha interesse em trabalhar comigo
            possa me encontrar, ver meu trabalho e tirar dúvidas.
          </p>
        </Message>
        {messages.map((m) => (
          <Message key={m.id} agent={m.role} message={m}>
            {m.parts.map((part) => {
              switch (part.type) {
                // render text parts as simple text:
                case 'text':
                  return part.text;

                // for tool invocations, distinguish between the tools and the state:
                case 'tool-invocation': {
                  const callId = part.toolInvocation.toolCallId;

                  switch (part.toolInvocation.toolName) {
                    case 'getProjects': {
                      switch (part.toolInvocation.state) {
                        case 'call':
                          return (
                            <div key={callId} className="text-gray-500">
                              Buscando projetos...
                            </div>
                          );
                        case 'result':
                          const { posts, answerIntroduction } =
                            part.toolInvocation.result;

                          return (
                            <div key={callId} className="grid gap-1.5">
                              <p>{answerIntroduction}</p>
                              {posts.map((post: any, i: number) => {
                                return (
                                  <div
                                    key={post._id + 'sugestion' + i}
                                    className="grid grid-cols-3 gap-3 items-center p-1 cursor-pointer border rounded border-transparent hover:bg-amber-100 hover:border-amber-200"
                                  >
                                    <div className="col-span-1">
                                      <div className="aspect-4/3 overflow-hidden relative rounded-sm border">
                                        <img
                                          src={urlFor(post.media[0])
                                            .width(300)
                                            .url()}
                                          className="w-full h-full object-cover object-center"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-span-2">
                                      <h2 className="font-bold text-xs !leading-tight">
                                        {post.title}
                                      </h2>
                                      <p className="text-xs text-stone-500">
                                        {post.label}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                              <h2 className="font-bold"></h2>
                            </div>
                          );
                      }
                      break;
                    }
                  }
                }
              }
            })}
          </Message>
        ))}

        <form onSubmit={handleSubmit}>
          <input
            className=""
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </ScrollArea>
  );
}
