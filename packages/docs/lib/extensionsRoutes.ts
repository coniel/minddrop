export const extensionsRoutes = [
  {
    label: 'Getting Started',
    pages: [
      {
        title: 'Introduction',
        slug: 'docs/extensions/getting-started/introduction',
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