import {RocketIcon} from '@sanity/icons'
import {MessageCircleQuestion} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Projeto',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      title: 'Título',
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      description:
        'A slug estará presente no URL em /projeto/[slug]. A alteração da slug após a primeira publicação do post pode quebrar referências que levem ao post e sua alteração é estritamente não recomendada.',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
      hidden: (context) => !context?.document?.title,
    }),
    defineField({
      title: 'Chapéu',
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Data de Início',
      validation: (rule) => rule.required(),
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'Data de Fim',
      type: 'date',
    }),
    defineField({
      title: 'Descrição',
      name: 'description',
      type: 'text',
      validation: (rule) => rule.required(),
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
      name: 'categories',
      title: 'Categorias',
      description: 'Inclua a publicação em uma ou mais categorias.',
      type: 'array',
      of: [
        {
          type: 'reference',
          name: 'post_category',
          to: [
            {
              type: 'category',
              preview: {
                select: {
                  name: 'name',
                },
              },
            },
          ],
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'media',
      type: 'array',
      of: [
        {name: 'video', type: 'file'},
        {name: 'image', type: 'image', fields: [{name: 'alt', type: 'string'}]},
      ],
    }),
  ],
})
