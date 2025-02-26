import supabase from '@/lib/db/supabase';
import { searchInSupabase } from '@/lib/embeddings';
import { client } from '@/sanity/client';
import { openai } from '@ai-sdk/openai';
import { generateObject, Message, streamText, tool } from 'ai';
import { flatten, flattenDeep, orderBy, uniq, uniqBy } from 'lodash';
import { SanityDocument } from 'next-sanity';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, id } = await req.json();
  const result = streamText({
    model: openai('gpt-4o-mini'),
    temperature: 1,
    frequencyPenalty: 1.2,
    maxTokens: 512,
    messages,
    maxSteps: 5,
    maxRetries: 3,
    system: `You are an AI assistant inside Vinícius Pereira's portfolio website. Vinícius is a web developer with a degree in Journalism and a background in design and video making. Your task is to respond to potential clients and employers as if you were Vinícius, using the first person.

### How to Answer
- Be polite and professional, but feel free to show some humor and a positive attitude when appropriate.
- Always use **brazilian portuguese**, unless the user asks otherwise.
- Keep answers **short and concise**.
- Only mention **frameworks, libraries, or tools** if explicitly asked about them.
- **Do not** add invitations for further questions, generic closings, or suggestions to continue the conversation.
- Avoid talking about personal life, like hobbies and tastes, unless the user explicitly asks for it.
- Avoid talking about your flaws, unless the user explicitly asks for it.

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
     ...
   }
   \`\`\`

### Response Guidelines
- **Always base responses strictly on the **context** from \`getInformation\`.**
- Don't display suggestedQuestions, those are for UI purposes.
- If no relevant context is found, simply state that you don’t have the information.
- When you can, always format your reply using **markdown**`,

    onError: (error) => {
      console.error(error);
    },
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
        description: `Get information from your knowledge base to answer questions and suggests two new questions.`,
        parameters: z.object({
          query: z.string().describe('the users original prompt'),
          optimizedQuery: z.string().describe('keywords to search')
        }),
        execute: async ({ optimizedQuery, query }) => {
          const results = await Promise.all(
            [query, optimizedQuery].map(
              async (question) => await searchInSupabase(question)
            )
          );

          const uniqueResults = Array.from(
            new Map(
              results
                .flat()
                .filter(Boolean)
                .map((item) => [item?.id, item])
            ).values()
          );
          console.log(uniqueResults.map((r) => r.metadata.title));

          const selectedResults = orderBy(
            uniqueResults,
            ['similarity'],
            ['desc']
          ).slice(0, 5);

          if (selectedResults.length === 0) {
            console.log('No selected results');
            return {
              context:
                'CONTEXT: """Infelizmente, não encontrei informações relevantes."""',
              posts: []
            };
          }
          let relatedWork = selectedResults.filter(
            (r) =>
              r.similarity > 0.35 &&
              r.metadata.relatedWork &&
              r.metadata.relatedWork.length > 0
          )
            ? flattenDeep(
                selectedResults
                  .filter(
                    (r) =>
                      r.metadata.relatedWork &&
                      r.metadata.relatedWork.length > 0
                  )
                  .map((p) =>
                    p.metadata.relatedWork.map((r: any) => ({
                      _ref: r._ref,
                      similarity: p.similarity
                    }))
                  )
              )
            : [];
          if (
            selectedResults.filter(
              (r) => r.similarity > 0.35 && r.metadata._type === 'project'
            ).length > 0
          ) {
            let projects = selectedResults
              .filter(
                (r) => r.similarity > 0.35 && r.metadata._type === 'project'
              )
              .map((p) => ({ _ref: p.id, similarity: p.similarity }));
            relatedWork = [...relatedWork, ...projects];
          }
          relatedWork = uniqBy(
            orderBy(relatedWork, ['similarity'], ['desc']),
            '_ref'
          ).slice(0, 2);

          const context = `CONTEXT: """\n${selectedResults
            .map((item) => `# ${item.metadata.title}\n${item.text}\n`)
            .join('\n')}"""
            
            QUESTION: """${query}"""`;
          try {
            const { object } = await generateObject({
              model: openai('gpt-4o-mini'),
              system: `You are a helpful assistant inside a web developer portfolio, where he shows his work and information about his education and skills. Based on the following context provided by a database and the user's original query, suggest two new interesting question suggestions to the user.
    
Always use brazilian portuguese. Look for questions that can be answered by the given CONTEXT. Keep questions short, not more than 6 words.

For example:
- If a specific work is mentioned, ask for more information about it.
- If technical terms are mentioned, ask for what they mean
- Be creative and create queations about the related to the mentioned topics`,
              schema: z.object({
                suggestedQuestions: z.array(z.string()).max(2)
              }),
              prompt: context
            });
            return {
              context,
              suggestedQuestions: object.suggestedQuestions,
              relatedWork
            };
          } catch (error) {
            return { context, suggestedQuestions: [], relatedWork };
          }
        }
      }),
      understandQuery: tool({
        description: `understand the users query. use this tool on every prompt. always run getInformation tool with the result, before sending an answer to the user`,
        parameters: z.object({
          query: z.string().describe('the users query')
        }),
        execute: async ({ query }) => {
          try {
            const { object } = await generateObject({
              model: openai('gpt-4o-mini'),
              system: `You are a query understanding assistant that processes user inputs. You will receive the user query and must rewrite it, optimizing it to be used in a vector search in a RAG strategy.`,
              schema: z.object({
                question: z.string()
              }),
              prompt: `Analyze this query: "${query}". Provide 3 similar questions.`
            });
            return { query, question: object.question };
          } catch (error) {
            console.error('Error in understandQuery:', error);
            return { query, question: '' };
          }
        }
      })
    }
  });

  return result.toDataStreamResponse();
}
