export const extensionsRoutes = [
  {
    label: 'Getting Started',
    pages: [
      {
        title: 'Introduction',
        slug: 'docs/extensions/getting-started/introduction',
      },
      {
        title: 'Extension Anatomy',
        slug: 'docs/extensions/getting-started/extension-anatomy',
      },
    ],
  },
  {
    label: 'Types',
    pages: [
      {
        title: 'ExtensionAppApi',
        slug: 'docs/extensions/types/extension-app-api',
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
        title: 'EventListener',
        slug: 'docs/extensions/types/event-listener',
      },
      {
        title: 'FileReference',
        slug: 'docs/extensions/types/file-reference',
      },
      {
        title: 'Lifecycle functions',
        slug: 'docs/extensions/types/lifecycle-functions',
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
        title: 'UIComponentConfig',
        slug: 'docs/extensions/types/ui-component-config',
      },
      {
        title: 'UILocation',
        slug: 'docs/extensions/types/ui-location',
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
