import { saveToSupabase } from '@/lib/embeddings';
import { client } from '@/sanity/client';
import { SanityDocument } from 'next-sanity';

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const projectsQuery = `*[_type == "project"]{title, _type, description, slug, _id, label, categories[]->{name}, url}`;
  const faqsQuery = `*[_type == "faq"]{_id, _type, title, text, relatedWork}`;
  try {
    const projects = await client.fetch<SanityDocument[]>(
      projectsQuery,
      {},
      { next: { revalidate: 30 } }
    );
    const faqs = await client.fetch<SanityDocument[]>(
      faqsQuery,
      {},
      { next: { revalidate: 30 } }
    );

    for (const project of projects) {
      await saveToSupabase(project._id, 'project', project.description, {
        title: project.title,
        url: project.url,
        slug: project.slug.current,
        label: project.label,
        _id: project._id,
        categories: project.categories.map((c: { name: string }) => c.name)
      });
    }
    for (const faq of faqs) {
      await saveToSupabase(faq._id, 'faq', faq.text, {
        title: faq.title,
        _id: faq._id,
        projects:
          faq.relatedWork?.length > 1
            ? faq.relatedWork.filter((c: any) => (c._type = 'projects'))
            : []
      });
    }

    // return Response.json({ faqs });
    return Response.json({ msg: 'Your database has been populated!' });
  } catch (error) {
    console.log(error);
    return Response.json({ posts: [] });
  }
}
