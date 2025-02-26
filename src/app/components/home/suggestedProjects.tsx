'use client';

import { postFetcher } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import useSWR from 'swr';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import Link from 'next/link';

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
          className="grid gap-2 rounded-xl bg-stone-100 border px-4 py-3"
        >
          <Collapsible className="w-full">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between space-x-4 w-full">
                <h4 className="text-sm font-semibold">Projetos relacionados</h4>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              {data.posts.map((post: any) => {
                return (
                  <Accordion key={post._id} type="single" collapsible>
                    <AccordionItem value={post._id}>
                      <AccordionTrigger>{post.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid md:flex gap-5">
                          <div className="grid gap-2">
                            <div className="aspect-video md:aspect-square rounded bg-stone-200 shrink-0 w-full md:w-36 md:h-36 relative overflow-hidden">
                              <img
                                src={urlFor(post.media[0]).width(512).url()}
                                alt=""
                                className="w-full h-full object-center object-cover"
                              />
                            </div>
                          </div>
                          <div className="grid gap-3">
                            <p className="text-xs shrink text-stone-600 self-center">
                              {post.description}
                            </p>
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
            </CollapsibleContent>
          </Collapsible>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
