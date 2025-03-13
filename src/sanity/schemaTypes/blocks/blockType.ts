import {defineField, defineType} from 'sanity'

export const blockType = defineType({
  name: 'blockBlock',
  title: 'Block Content',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      text: 'content',
    },
    prepare({text}) {
      return {
        title: text[0].children[0].text,
      }
    },
  },
})
