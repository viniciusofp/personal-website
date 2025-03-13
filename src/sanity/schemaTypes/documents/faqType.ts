import {MessageCircleQuestion} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: MessageCircleQuestion,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'text',
      type: 'text',
    }),
    defineField({
      name: 'relatedWork',
      title: 'Trabalhos relacionados',
      type: 'array',
      of: [
        {
          type: 'reference',
          name: 'projects',
          to: [
            {
              type: 'project',
              preview: {
                select: {
                  name: 'name',
                },
              },
            },
            {
              type: 'faq',
              preview: {
                select: {
                  name: 'name',
                },
              },
            },
          ],
        },
      ],
    }),
  ],
})
