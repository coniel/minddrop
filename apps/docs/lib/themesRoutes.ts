export const themesRoutes = [
  {
    label: 'Getting Started',
    pages: [
      {
        title: 'Setup',
        slug: 'docs/themes/getting-started/setup',
        draft: false,
      },
    ],
  },

  {
    label: 'Colors',
    pages: [
      {
        title: 'The Scales',
        slug: 'docs/themes/colors/the-scales',
        draft: false,
      },
      {
        title: 'Understanding the scale',
        slug: 'docs/themes/colors/understanding-the-scale',
        draft: false,
      },
    ],
  },
];

export const allthemesRoutes = themesRoutes.reduce(
  (acc, curr) => [...acc, ...curr.pages.filter((p) => p.draft !== true)],
  [],
);
