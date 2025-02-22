import supabase from '@/lib/db/supabase';
import { searchInSupabase } from '@/lib/embeddings';
import { client } from '@/sanity/client';
import { openai } from '@ai-sdk/openai';
import { generateObject, Message, streamText, tool } from 'ai';
import { orderBy, uniq } from 'lodash';
import { SanityDocument } from 'next-sanity';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, id } = await req.json();
  const result = streamText({
    model: openai('gpt-4o-mini'),
    temperature: 0.4,
    frequencyPenalty: 1.2,
    maxTokens: 512,
    messages,
    maxSteps: 5,
    system: `
You are an assistant inside Vinícius Pereira's portfolio website. Vinícius Pereira is a web developer, with a bachelor degree in Journalism and some design and video making background. Your task is to answer users who are potential Vinícius's clients as if you were himself, so you must speak in the first person.

Tools: 
- You must always use two tools to answer the questions you are asked: understandQuery and getInformation.
- First, run understandQuery. It will receive the user's query and return a JSON object with the original query and three alternatives for the same query, like this:
${'```'}
{
  query: 'Com o que você trabalha?',
  questions: [
    'Qual é a sua profissão?',
    'Em que área você atua?',
    'O que você faz para viver?'
  ]
}
${'```'}

- After undertandQuery, run getInformation. This tool will receive the parameters from understandQuery and search for data to answer the user question. It will return a JSON object with the context provided from the database and posts related to the query's subject, like this:
${'```'}
{
  context: '\n' +
    'CONTEXT: """\n' +
    '# Como me contratar\n' +
    'Atualmente trabalho como CTO na Lanzy e tenho disponibilidade parcial para participar no desenvolvimento de projetos. Caso deseje entrar em contato comigo, envie um email para viniciusofp@gmail.com ou uma mensagem para o número (11) 97697-0327.\n' +
    '\n' +
    '# Experiência com vídeo\n' +
    'Tenho experiência com:\n' +
    '- Montagem e edição de vídeos em softwares como Adobe Premiere e Final Cut\n' +
    '- Criação de motion graphics em softwares como Adobe After Effects\n' +
    '\n' +
    '# Formação acadêmica\n' +
    'Sou formado bacharel em Comunicação Social com habilitação em Jornalismo pela Escola de Comunicações e Artes da Universidade de São Paulo (ECA-USP). Realizei minha graduação entre os anos de 2011 e 2017.\n' +
    '\n' +
    '# Experiência com desenvolvimento web, tecnologia e programação\n' +
    'Desde muito cedo me interessei e passei a estudar programação, desenvolvimento web e tecnologias digitais em geral. Ao longo da carreira, apesar de ter me formado em Jornalismo e atuado como designer e videomaker por um período, acabei me especializando no desenvolvimento de sites.\n' +
    '"""',
  posts: [
    ...
  ]
}
${'```'}

Answer the user's query based on the context provided by getInformation tool. Ignore the posts, those you be used in the client-side exclusively.

Keep your answers short and concise, and style them with markdown. Always speak brazilian portuguese, unless asked for something different. Just rely on context receive from getInformation tool to generate your response. If you can't find an answer to the question, say so.

Do not add invitations for further questions, generic closing phrases, or suggestions for the user to continue the conversation. Simply provide the requested information.

Only mention specific frameworks, libraries of softwares used by Vinícius is asked directly about it.`,
    onFinish: async (res) => {
      const chatMessages = [
        ...messages.map((m: Message) => ({ role: m.role, content: m.content })),
        { role: 'assistant', content: res.text }
      ];
      const now = new Date();
      const { error } = await supabase
        .from('conversations')
        .upsert({ chat_id: id, messages: chatMessages, updated_at: now });
      if (error) console.error('Error fetching conversations:', error);
    },
    tools: {
      getInformation: tool({
        description: `Get information from your knowledge base to answer questions.`,
        parameters: z.object({
          query: z.string().describe('the users original prompt'),
          similarQuestions: z.array(z.string()).describe('keywords to search')
        }),
        execute: async ({ similarQuestions, query }) => {
          const results = await Promise.all(
            similarQuestions.map(async (query) => await searchInSupabase(query))
          );
          // Flatten the array of arrays and remove duplicates based on 'id'
          const uniqueResults = Array.from(
            new Map(results.flat().map((item) => [item?.id, item])).values()
          );
          const selectedResults = orderBy(
            uniqueResults,
            ['similarity'],
            ['desc']
          ).slice(0, 5);
          const context = `CONTEXT: """
${selectedResults.map((item) => {
  return `# ${item.metadata.title}
${item.text}

`;
})}"""`;
          let relatedProjects: any = [];
          selectedResults.forEach((element) => {
            relatedProjects.push(
              ...element.metadata.projects.map((proj: any) => ({
                ...proj,
                similarity: element.similarity
              }))
            );
          });
          relatedProjects = uniq(
            orderBy(relatedProjects, ['similarity'], ['desc']).slice(0, 3)
          );
          if (relatedProjects.length > 0) {
            const QROG = `*[_id in ${JSON.stringify(relatedProjects.map((p: any) => p._ref))}]`;
            try {
              const posts = await client.fetch<SanityDocument[]>(
                QROG,
                {},
                { next: { revalidate: 30 } }
              );
              return { context, posts };
            } catch (error) {
              console.log(error);
              return { context };
            }
          }

          return { context };
        }
      }),
      understandQuery: tool({
        description: `understand the users query. use this tool on every prompt. always run getInformation tool with the result, before sending an answer to the user`,
        parameters: z.object({
          query: z.string().describe('the users query'),
          toolsToCallInOrder: z
            .array(z.string())
            .describe(
              'these are the tools you need to call in the order necessary to respond to the users query, dont include understandQuery'
            )
        }),
        execute: async ({ query }) => {
          const { object } = await generateObject({
            model: openai('gpt-4o-mini'),
            system:
              'You are a query understanding assistant. Analyze the user query and generate similar questions.',
            schema: z.object({
              questions: z
                .array(z.string())
                .max(3)
                .describe("similar questions to the user's query. be concise.")
            }),
            prompt: `Analyze this query: "${query}". Provide the following:
                    3 similar questions that could help answer the user's query`
          });
          return { query, questions: object.questions };
        }
      })
    }
  });

  return result.toDataStreamResponse();
}
