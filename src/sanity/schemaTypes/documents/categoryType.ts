import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
      hidden: (context) => !context?.document?.name,
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      description: 'Crie uma descrição para a categoria.',
      type: 'text',
      rows: 3,
    }),
  ],
})
