import {CogIcon, DocumentIcon, EarthGlobeIcon, LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const infoSeoType = defineType({
  name: 'infoSeo',
  title: 'Site Info and SEO',
  type: 'document',
  icon: EarthGlobeIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'title',
      title: 'Site Name',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Your logo.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description:
        'Displayed on social cards and search engine results. It should be 1200 X 630 pixels.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'favIcon',
      title: 'Favicon Image',
      type: 'image',
      description: 'Displayed on a tab in a browser before your website title.',
      options: {
        hotspot: true,
      },
    }),
    // defineField({
    //   title: 'Display "Last updated" at the footer of the website',
    //   description: 'Turn on to display time whe you last added new project to your Home page',
    //   name: 'displayLastUpdated',
    //   type: 'boolean',
    // }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Info and SEO',
      }
    },
  },
})
