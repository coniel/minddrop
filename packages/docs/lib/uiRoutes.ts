export const uiRoutes = [
  {
    label: 'Overview',
    pages: [
      { title: 'Introduction', slug: 'docs/ui/overview/introduction' },
      {
        title: 'Getting started',
        slug: 'docs/ui/overview/getting-started',
      },
      { title: 'Styling', slug: 'docs/ui/overview/styling' },
      { title: 'Releases', slug: 'docs/ui/overview/releases' },
    ],
  },

  {
    label: 'Components',
    pages: [
      { title: 'Button', slug: 'docs/ui/components/button' },
      { title: 'Text', slug: 'docs/ui/components/text' },
      { title: 'IconButton', slug: 'docs/ui/components/icon-button' },
      { title: 'Toolbar', slug: 'docs/ui/components/toolbar' },
      { title: 'Tooltip', slug: 'docs/ui/components/tooltip' },
      {
        title: 'KeyboardShortcut',
        slug: 'docs/ui/components/keyboard-shortcut',
      },
      { title: 'InvisibleTextField', slug: 'docs/ui/components/invisible-text-field' },
      // TEMPLATE_APPEND
    ],
  },

  {
    label: 'Utilities',
    pages: [
      {
        title: 'Map props to classes',
        slug: 'docs/ui/utilities/map-props-to-classes',
      },
      {
        title: 'Accessible Icon',
        slug: 'docs/ui/utilities/accessible-icon',
      },
      { title: 'Portal', slug: 'docs/ui/utilities/portal' },
      {
        title: 'Visually Hidden',
        slug: 'docs/ui/utilities/visually-hidden',
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

export const allUiRoutes = uiRoutes.reduce((acc, curr: RouteProps) => {
  return [...acc, ...curr.pages.filter((p) => p.draft !== true)];
}, []);
