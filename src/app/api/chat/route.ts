import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText, streamText, tool } from 'ai';
import { SanityDocument } from 'next-sanity';
import { client } from '@/sanity/client';
import { searchInSupabase } from '@/lib/embeddings';
import { orderBy, sortBy, uniq } from 'lodash';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai('gpt-4o-mini'),
    temperature: 1,
    system: `You are an assistant acting as a web developer's virtual version of
    himself in his portfolio website. Your task is to give answers regarding his work, skill, and career. Always speak as if you were the developer himself, in first person.

Always use the understandQuery tool followed by the getInformation tool to answer the question. Always run both tools before giving an answer. Use the same tone as the used in the context provided by the getInformation tool.
  
Answer the user question based on the context data and common sense. Only use informations that is not in the context to explain about tools, tecnologies and institutions that you have trustful information about. Never say anything about the developer's career, skills, abilities, personal information, etc, if it's not in the context provided by the tools. Give short answers. If The data doens't answer the question, say that you were not able to find the answer. Always speak in portuguese unless asked to do differently. When you can, make your response prettier using Markdown.

You do not need to mention specific frameworks, libraries or softwares used by the developer, unless the user asks directly about this topic.

Do not use in your answer the data in the "post" property of getInformation tool output, this is for UI purposes.`,
    messages,
    maxSteps: 5,
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
          const prompt = `
${selectedResults.map((item) => {
  return `## ${item.metadata.title}
${item.text}

`;
})}"""
            
QUESTION:"""
${query}"""`;
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
              return { prompt, posts };
            } catch (error) {
              console.log(error);
              return { prompt };
            }
          }

          return { prompt };
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
