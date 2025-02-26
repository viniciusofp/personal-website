import { openai } from '@ai-sdk/openai';
import supabase from './db/supabase';
import { embed, embedMany } from 'ai';

const embeddingModel = openai.embedding('text-embedding-3-small');

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input
  });
  return embedding;
};

export const saveToSupabase = async (
  id: string,
  type: string,
  text: string,
  metadata = {}
) => {
  const embedding = await generateEmbedding(text);
  await supabase.from('documents').delete().neq('_id', '0');
  const { data, error } = await supabase
    .from('documents')
    .insert({ id, type, text, embedding, metadata });

  if (error) console.error('Erro ao salvar:', error);
  return data;
};

export const searchInSupabase = async (query: string) => {
  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.3,
    match_count: 5
  });

  if (error) console.error('Erro na busca:', error);
  return data;
};
