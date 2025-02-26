'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { postFetcher } from '@/lib/utils';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import useSWR from 'swr';

export type SuggestedProjectsProps = {
  relatedWork: { _ref: string }[];
};

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export default function SuggestedProjects({
  relatedWork
}: SuggestedProjectsProps) {
  const body = {
    QROG: `*[_id in [${relatedWork.slice(0, 2).map((p) => `"${p._ref}"`)}]]{..., media[]}`
  };
  const { data, error, isLoading } = useSWR(
    relatedWork.length > 0 ? ['/api/sanity', body] : null, // Only fetch if body is provided
    ([url, body]) => postFetcher(url, body)
  );

  if (!data || data?.posts.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto w-full px-16">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ delay: 0.5 }}
          className="grid gap-2"
        >
          <h3 className="text-blue-700 font-bold text-sm pl-3 border-l-2">
            Projetos sugeridos
          </h3>
          {data.posts.map((post: any) => {
            return (
              <Accordion key={post._id} type="single" collapsible>
                <AccordionItem value={post._id}>
                  <AccordionTrigger>{post.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:flex gap-5 px-4 py-3 bg-stone-100 border rounded-xl">
                      <div className="grid gap-2 shrink-0 w-full md:w-1/3">
                        <div className="aspect-video md:aspect-square rounded bg-stone-200 relative overflow-hidden">
                          <img
                            src={urlFor(post.media[0]).width(512).url()}
                            alt=""
                            className="w-full h-full object-center object-cover"
                          />
                        </div>
                      </div>
                      <div className="grid gap-3 self-center">
                        <div>
                          <h3 className="font-bold mb-1">{post.label}</h3>
                          <p className=" text-xs shrink text-stone-600">
                            {post.description}
                          </p>
                        </div>
                        {!!post.url ? (
                          <Link
                            href={post.url}
                            target="_blank"
                            className="w-full"
                          >
                            <Button size={'sm'} variant={'outline'}>
                              Acessar o site
                            </Button>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
