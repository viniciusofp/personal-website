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
    maxTokens: 512,
    messages,
    maxSteps: 5,
    maxRetries: 2,
    system: `You are an AI assistant inside Vinícius Pereira's portfolio website. Vinícius is a web developer with a degree in Journalism and a background in design and video making. Your task is to respond to potential clients and employers as if you were Vinícius, using the first person.

### How to Answer
- Always use **brazilian portuguese**, unless the user asks otherwise.
- Keep answers **short and concise**, formatted with **markdown**.
- Only mention **frameworks, libraries, or tools** if explicitly asked about them.
- **Do not** add invitations for further questions, generic closings, or suggestions to continue the conversation.
- **Do not** provide personal information unless the user explicitly asks for it.

### Tools You Must Use
To answer questions, you will rely on two tools: \`understandQuery\` and \`getInformation\`.

1. **understandQuery**  
   - Receives the user’s query and returns three alternative phrasings of the same question.
   - Example output:
   \`\`\`json
   {
     "query": "Com o que você trabalha?",
     "questions": [
       "Qual é a sua profissão?",
       "Em que área você atua?",
       "O que você faz para viver?"
     ]
   }
   \`\`\`

2. **getInformation**  
   - Uses the queries from \`understandQuery\` to retrieve relevant information.
   - Returns a \`context\` string with structured information about Vinícius.
   - Example output:
   \`\`\`json
   {
     "context": "CONTEXT: \"\"\"\n# Como me contratar\nAtualmente trabalho como CTO na Lanzy e tenho disponibilidade parcial para projetos. Contato: viniciusofp@gmail.com\n...\n\"\"\"",
     "posts": [...]
   }
   \`\`\`

### Response Guidelines
- **Always base responses strictly on the context from \`getInformation\`.** 
- Always reply.
- If no relevant context is found, simply state that you don’t have the information.`,
    onFinish: async (res) => {
      // console.log(res);
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
          console.log('Executing getInformation for query:', similarQuestions);

          const results = await Promise.all(
            [query, ...similarQuestions].map(
              async (question) => await searchInSupabase(question)
            )
          );

          console.log('Got this number of results', results.length);
          const uniqueResults = Array.from(
            new Map(
              results
                .flat()
                .filter(Boolean)
                .map((item) => [item?.id, item])
            ).values()
          );
          console.log(
            'Got this number of unique results',
            uniqueResults.length
          );

          const selectedResults = orderBy(
            uniqueResults,
            ['similarity'],
            ['desc']
          ).slice(0, 5);
          console.log(
            'Got this number of selected results',
            selectedResults.length
          );

          if (selectedResults.length === 0) {
            console.log('No selected results');
            return {
              context:
                'CONTEXT: """Infelizmente, não encontrei informações relevantes."""',
              posts: []
            };
          }

          const context = `CONTEXT: """\n${selectedResults
            .map((item) => `# ${item.metadata.title}\n${item.text}\n`)
            .join('\n')}"""
            
            QUESTION: """${query}"""`;

          // let relatedProjects: any = [];
          // selectedResults.forEach((element) => {
          //   relatedProjects.push(
          //     ...element.metadata.projects.map((proj: any) => ({
          //       ...proj,
          //       similarity: element.similarity
          //     }))
          //   );
          // });

          // relatedProjects = uniq(
          //   orderBy(relatedProjects, ['similarity'], ['desc']).slice(0, 3)
          // );
          // console.log(context);

          // if (relatedProjects.length > 0) {
          //   const projectIds = relatedProjects.map((p: any) => p._ref);
          //   if (projectIds.length > 0) {
          //     const QROG = `*[_type == "project" && _id in ${JSON.stringify(projectIds)}]`;
          //     try {
          //       const posts = await client.fetch<SanityDocument[]>(
          //         QROG,
          //         {},
          //         { next: { revalidate: 30 } }
          //       );
          //       return { context, posts };
          //     } catch (error) {
          //       console.log(error);
          //       return { context, posts: [] };
          //     }
          //   }
          // }

          return { context, posts: [] };
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
          console.log('understandQuery');
          try {
            const { object } = await generateObject({
              model: openai('gpt-4o-mini'),
              system: 'You are a query understanding assistant...',
              schema: z.object({
                questions: z.array(z.string()).max(3)
              }),
              prompt: `Analyze this query: "${query}". Provide 3 similar questions.`
            });
            return { query, questions: object.questions };
          } catch (error) {
            console.error('Error in understandQuery:', error);
            return { query, questions: [] };
          }
        }
      })
    }
  });

  return result.toDataStreamResponse();
}
