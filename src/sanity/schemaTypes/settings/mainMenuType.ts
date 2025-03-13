import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const mainMenuType = defineType({
  name: 'mainMenu',
  type: 'document',
  fields: [
    {
      name: 'menu',
      type: 'array',
      of: [
        defineField({
          name: 'menuItem',
          title: 'Item do menu',
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
            },
            {
              title: 'URL',
              name: 'url',
              type: 'url',
              description: 'enter an external URL',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
            prepare({title, subtitle}) {
              return {
                title,
                subtitle,
                media: LinkIcon,
              }
            },
          },
        }),
      ],
    },
  ],
})
