import {MessageCircleQuestion} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const buttonType = defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'URL',
      name: 'url',
      type: 'url',
      description: 'enter an external URL',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'variant',
      type: 'string',
      options: {list: ['Primary', 'Secondary', 'Outline', 'Ghost', 'Link']},
    }),
  ],
})
