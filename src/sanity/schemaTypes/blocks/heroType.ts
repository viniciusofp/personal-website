import {defineField, defineType} from 'sanity'

export const heroType = defineType({
  name: 'hero',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'text',
      type: 'blockContent',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'buttons',
      type: 'array',
      of: [
        {
          name: 'button',
          type: 'button',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'text',
      media: 'image',
    },
    prepare({title, media, subtitle}) {
      return {
        title: `Hero: ${title}`,
        media,
      }
    },
  },
})
