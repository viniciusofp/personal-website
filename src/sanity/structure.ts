import {
  CogIcon,
  EarthGlobeIcon,
  HomeIcon,
  MenuIcon,
  RocketIcon
} from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Configurações')
        .child(
          S.list()
            .title('Configurações')
            .items([
              S.listItem()
                .title('Site Info and SEO')
                .child(S.document().schemaType('infoSeo').documentId('infoSeo'))
                .icon(EarthGlobeIcon),
              S.listItem()
                .title('Menu Principal')
                .child(
                  S.document()
                    .schemaType('mainMenu')
                    .documentId('mainMenu')
                    .title('Menu Principal')
                )
                .icon(MenuIcon)
            ])
        )
        .icon(CogIcon),
      S.listItem()
        .title('Página inicial')
        .child(S.document().schemaType('home').documentId('home'))
        .icon(HomeIcon),
      S.divider(),
      S.listItem()
        .title('Projetos')
        .child(
          S.list()
            .title('Projetos')
            .items([
              S.documentTypeListItem('project').title('Projetos'),
              S.documentTypeListItem('category').title('Categorias')
            ])
        )
        .icon(RocketIcon),
      S.divider(),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('qea').title('Q&A - Fine-tuning')
      // S.divider(),
      // ...S.documentTypeListItems().filter(
      //   (item) =>
      //     item.getId() &&
      //     ![
      //       'post',
      //       'category',
      //       'author',
      //       'page',
      //       'faq',
      //       'settings',
      //       'home',
      //       'media.tag',
      //       'infoSeo',
      //     ].includes(item.getId()!),
      // ),
    ]);
