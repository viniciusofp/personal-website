import {defineField, defineType} from 'sanity'

export const splitImageType = defineType({
  name: 'splitImage',
  type: 'object',
  fields: [
    defineField({
      name: 'orientation',
      type: 'string',
      options: {
        list: [
          {value: 'imageLeft', title: 'Image Left'},
          {value: 'imageRight', title: 'Image Right'},
        ],
      },
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'text',
      media: 'image',
      orientation: 'orientation',
    },
    prepare({title, subtitle, orientation, media}) {
      return {
        title,
        subtitle: orientation === 'imageRight' ? 'Imagem à direita' : 'Imagem à esquerda',
        media,
      }
    },
  },
})
