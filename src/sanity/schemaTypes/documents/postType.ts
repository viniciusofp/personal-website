import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      description: 'Este será o título da publicação e o meta title para SEO.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      description:
        'A slug estará presente no URL em /blog/[slug]. A alteração da slug após a primeira publicação do post pode quebrar referências que levem ao post e sua alteração é estritamente não recomendada.',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
      hidden: (context) => !context?.document?.title,
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      description: 'Esse texto é usado como subtítulo e como meta description para SEO.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Imagem em destaque',
      type: 'image',
      options: {
        hotspot: true,
      },
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
      name: 'body',
      title: 'Conteúdo',
      type: 'blockContent',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de Publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
})
