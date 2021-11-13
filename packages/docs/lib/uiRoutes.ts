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
      {
        title: 'InvisibleTextField',
        slug: 'docs/ui/components/invisible-text-field',
      },
      { title: 'Popover', slug: 'docs/ui/components/popover' },
      { title: 'Separator', slug: 'docs/ui/components/separator' },
      { title: 'ContextMenu', slug: 'docs/ui/components/context-menu' },
      { title: 'Menu', slug: 'docs/ui/components/menu' },
      { title: 'DropdownMenu', slug: 'docs/ui/components/dropdown-menu' },
      { title: 'Sidebar', slug: 'docs/ui/components/sidebar' },
      { title: 'Collapsible', slug: 'docs/ui/components/collapsible' },
      { title: 'TopicNavItem', slug: 'docs/ui/components/topic-nav-item' },
      { title: 'PrimaryNavItem', slug: 'docs/ui/components/primary-nav-item' },
      { title: 'SecondaryNavItem', slug: 'docs/ui/components/secondary-nav-item' },
      { title: 'NavGroup', slug: 'docs/ui/components/nav-group' },
      { title: 'Icon', slug: 'docs/ui/components/icon' },
      { title: 'Breadcrumbs', slug: 'docs/ui/components/breadcrumbs' },
      { title: 'Drop', slug: 'docs/ui/components/drop' },
      { title: 'Tag', slug: 'docs/ui/components/tag' },
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
