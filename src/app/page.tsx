import { client } from '@/sanity/client';
import { Linkedin } from 'lucide-react';
import { type SanityDocument } from 'next-sanity';
import Chat from './components/home/chat';

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

const menu = [
  {
    title: 'Linkedin',
    slug: 'escritorio',
    icon: (props: any) => <Linkedin {...props} />
  },
  { title: 'Áreas de atuação', slug: 'areas-de-atuacao' },
  { title: 'Contato', slug: 'contato' }
];

export default async function IndexPage() {
  return (
    <main className="relative flex min-h-svh flex-1 flex-col peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow">
      <Chat />
      {/* <ul className="flex flex-col gap-y-4 h-svh">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <Link href={`/${post.slug.current}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul> */}
      {/* <div className="flex absolute bottom-3 left-1/2 -translate-x-1/2 gap-2">
        <Button size={'sm'}>Projetos</Button>
        <Button size={'sm'}>Linkedin</Button>
        <Button size={'sm'}>Contato</Button>
      </div> */}
    </main>
  );
}
