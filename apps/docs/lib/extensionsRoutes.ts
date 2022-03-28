export const extensionsRoutes = [
  {
    label: 'Getting Started',
    pages: [
      {
        title: 'Introduction',
        slug: 'docs/extensions/getting-started/introduction',
      },
      // {
      //   title: 'Creating your first extension',
      //   slug: 'docs/extensions/getting-started/extension-anatomy',
      // },
    ],
  },
  // {
  //   label: 'Walkthroughs',
  //   pages: [
  //     {
  //       title: 'Reacting to events',
  //       slug: 'docs/extensions/walkthroughs/event-listeners.mdx',
  //     },
  //     {
  //       title: 'Adding new drop types',
  //       slug: 'docs/extensions/walkthroughs/drops.mdx',
  //     },
  //     {
  //       title: 'Extending the UI',
  //       slug: 'docs/extensions/walkthroughs/ui-extensions.mdx',
  //     },
  //     {
  //       title: 'Adding views',
  //       slug: 'docs/extensions/walkthroughs/views.mdx',
  //     },
  //     {
  //       title: 'Creating a storage adapter',
  //       slug: 'docs/extensions/walkthroughs/storage-adapter.mdx',
  //     },
  //     {
  //       title: 'Making extensible extensions',
  //       slug: 'docs/extensions/walkthroughs/extensible-extensions.mdx',
  //     },
  //   ],
  // },
  {
    label: 'API',
    pages: [
      {
        title: 'App',
        slug: 'docs/extensions/api/app',
      },
      {
        title: 'Core',
        slug: 'docs/extensions/api/core',
      },
      {
        title: 'Drops',
        slug: 'docs/extensions/api/drops',
      },
      {
        title: 'Extensions',
        slug: 'docs/extensions/api/extensions',
      },
      {
        title: 'Files',
        slug: 'docs/extensions/api/files',
      },
      {
        title: 'PersistentStore',
        slug: 'docs/extensions/api/persistent-store',
      },
      {
        title: 'RichTextDocuments',
        slug: 'docs/extensions/api/rich-text-documents',
      },
      {
        title: 'RichTextElements',
        slug: 'docs/extensions/api/rich-text-elements',
      },
      {
        title: 'Tags',
        slug: 'docs/extensions/api/tags',
      },
      {
        title: 'Topics',
        slug: 'docs/extensions/api/topics',
      },
      {
        title: 'Utils',
        slug: 'docs/extensions/api/utils',
      },
      {
        title: 'Views',
        slug: 'docs/extensions/api/views',
      },
    ],
  },
  {
    label: 'Types',
    pages: [
      {
        title: 'Color',
        slug: 'docs/extensions/types/color',
      },
      {
        title: 'DataInsert',
        slug: 'docs/extensions/types/data-insert',
      },
      {
        title: 'Drop',
        slug: 'docs/extensions/types/drop',
      },
      {
        title: 'DropConfig',
        slug: 'docs/extensions/types/drop-config',
      },
      {
        title: 'EventListenerCallback',
        slug: 'docs/extensions/types/event-listener-callback',
      },
      {
        title: 'Extension',
        slug: 'docs/extensions/types/extension',
      },
      {
        title: 'ExtensionConfig',
        slug: 'docs/extensions/types/extension-config',
      },
      {
        title: 'ExtensionDocument',
        slug: 'docs/extensions/types/extension-document',
      },
      {
        title: 'FileReference',
        slug: 'docs/extensions/types/file-reference',
      },
      {
        title: 'ParentReference',
        slug: 'docs/extensions/types/parent-reference',
      },
      {
        title: 'ResourceConnector',
        slug: 'docs/extensions/types/resource-connector',
      },
      {
        title: 'RichTextNode',
        slug: '/docs/extensions/types/rich-text-node',
      },
      {
        title: 'RichTextElement',
        slug: 'docs/extensions/types/rich-text-element',
      },
      {
        title: 'RichTextFragment',
        slug: 'docs/extensions/types/rich-text-fragment',
      },
      {
        title: 'RichTextDocument',
        slug: 'docs/extensions/types/rich-text-document',
      },
      {
        title: 'RichTextBlockElement',
        slug: 'docs/extensions/types/rich-text-block-element',
      },
      {
        title: 'RichTextInlineElement',
        slug: 'docs/extensions/types/rich-text-inline-element',
      },
      {
        title: 'RichTextBlockElementConfig',
        slug: 'docs/extensions/types/rich-text-block-element-config',
      },
      {
        title: 'RichTextInlineElementConfig',
        slug: 'docs/extensions/types/rich-text-inline-element-config',
      },
      {
        title: 'Slot',
        slug: 'docs/extensions/types/slot',
      },
      {
        title: 'Tag',
        slug: 'docs/extensions/types/tag',
      },
      {
        title: 'Topic',
        slug: 'docs/extensions/types/topic',
      },
      {
        title: 'TopicView',
        slug: 'docs/extensions/types/topic-view',
      },
      {
        title: 'TopicViewConfig',
        slug: 'docs/extensions/types/topic-view-config',
      },
      {
        title: 'TopicViewInstance',
        slug: 'docs/extensions/types/topic-view-instance',
      },
      {
        title: 'UiComponentConfig',
        slug: 'docs/extensions/types/ui-component-config',
      },
      {
        title: 'UiLocation',
        slug: 'docs/extensions/types/ui-location',
      },
      {
        title: 'View',
        slug: 'docs/extensions/types/view',
      },
      {
        title: 'ViewConfig',
        slug: 'docs/extensions/types/view-config',
      },
      {
        title: 'ViewInstance',
        slug: 'docs/extensions/types/view-instance',
      },
    ],
  },
];

export type PageProps = {
  title: string;
  slug: string;
  draft?: boolean;
  deprecated?: boolean;
};

export type RouteProps = {
  label: string;
  pages: PageProps[];
};

export const allExtensionsRoutes = extensionsRoutes.reduce(
  (acc, curr: RouteProps) => {
    return [...acc, ...curr.pages.filter((p) => p.draft !== true)];
  },
  [],
);
