import { client } from '@/sanity/client';
import { SanityDocument } from 'next-sanity';
import { NextRequest } from 'next/server';

const options = { next: { revalidate: 30 } };

export async function POST(request: NextRequest) {
  const { QROG } = await request.json();

  const posts = await client.fetch<SanityDocument[]>(QROG, {}, options);

  return Response.json({ posts });
}
