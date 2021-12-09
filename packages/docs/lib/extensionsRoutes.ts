export const extensionsRoutes = [
  {
    label: 'Getting Started',
    pages: [
      {
        title: 'Introduction',
        slug: 'docs/extensions/getting-started/introduction',
      },
      {
        title: 'Creating your first extension',
        slug: 'docs/extensions/getting-started/extension-anatomy',
      },
    ],
  },
  {
    label: 'Walkthroughs',
    pages: [
      {
        title: 'Reacting to events',
        slug: 'docs/extensions/walkthroughs/event-listeners.mdx',
      },
      {
        title: 'Adding new drop types',
        slug: 'docs/extensions/walkthroughs/drops.mdx',
      },
      {
        title: 'Extending the UI',
        slug: 'docs/extensions/walkthroughs/ui-extensions.mdx',
      },
      {
        title: 'Adding views',
        slug: 'docs/extensions/walkthroughs/views.mdx',
      },
      {
        title: 'Creating a storage adapter',
        slug: 'docs/extensions/walkthroughs/storage-adapter.mdx',
      },
      {
        title: 'Making extensible extensions',
        slug: 'docs/extensions/walkthroughs/extensible-extensions.mdx',
      },
    ],
  },
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
        title: 'Extension',
        slug: 'docs/extensions/api/extension',
      },
      {
        title: 'Files',
        slug: 'docs/extensions/api/files',
      },
      {
        title: 'Tags',
        slug: 'docs/extensions/api/tags',
      },
      {
        title: 'Topics',
        slug: 'docs/extensions/api/topics',
      },
    ],
  },
  {
    label: 'Types',
    pages: [
      {
        title: 'Breadcrumb',
        slug: 'docs/extensions/types/breadcrumb',
      },
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
        title: 'EventListenerCallback',
        slug: 'docs/extensions/types/event-listener-callback',
      },
      {
        title: 'FileReference',
        slug: 'docs/extensions/types/file-reference',
      },
      {
        title: 'ResourceConnector',
        slug: 'docs/extensions/types/resource-connector',
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
        title: 'UiComponentConfig',
        slug: 'docs/extensions/types/ui-component-config',
      },
      {
        title: 'UiLocation',
        slug: 'docs/extensions/types/ui-location',
      },
      {
        title: 'ViewConfig',
        slug: 'docs/extensions/types/view-config',
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
