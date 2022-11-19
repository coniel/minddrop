export const guidesRoutes = [
  {
    label: 'Getting Started',
    pages: [
      {
        title: 'Introduction',
        slug: 'docs/guides/getting-started/introduction',
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

export const allGuidesRoutes = guidesRoutes.reduce(
  (acc, curr: RouteProps) => [
    ...acc,
    ...curr.pages.filter((p) => p.draft !== true),
  ],
  [],
);
