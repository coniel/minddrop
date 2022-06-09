export const apiRoutes = [
  {
    label: 'Getting Started',
    pages: [
      {
        title: 'Introduction',
        slug: 'docs/api/getting-started/introduction',
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

export const allApiRoutes = apiRoutes.reduce((acc, curr: RouteProps) => {
  return [...acc, ...curr.pages.filter((p) => p.draft !== true)];
}, []);
