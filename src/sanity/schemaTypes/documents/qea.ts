import {MessageCircleQuestion} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const qeaType = defineType({
  name: 'qea',
  title: 'Q&A - Fine tuning',
  type: 'document',
  icon: MessageCircleQuestion,

  fields: [
    defineField({
      name: 'messages',
      type: 'array',
      of: [
        defineField({
          name: 'message',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Question',
              type: 'string',
              description: 'The user input.',
            }),
            defineField({
              name: 'text',
              title: 'Answer',
              type: 'text',
              description: 'The chat reply.',
            }),
          ],

          preview: {
            select: {
              title: 'title',
              subtitle: 'text',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      messages: 'messages',
    },
    prepare: ({messages}) => {
      return messages.length > 0
        ? {title: `${messages[0].title} (${messages.length})`}
        : {title: 'Documento vazio!'}
    },
  },
})
