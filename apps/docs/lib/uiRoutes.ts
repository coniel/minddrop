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
      { title: 'Breadcrumbs', slug: 'docs/ui/components/breadcrumbs' },
      { title: 'Button', slug: 'docs/ui/components/button' },
      { title: 'Collapsible', slug: 'docs/ui/components/collapsible' },
      { title: 'ContextMenu', slug: 'docs/ui/components/context-menu' },
      { title: 'Dialog', slug: 'docs/ui/components/dialog' },
      { title: 'Drop', slug: 'docs/ui/components/drop' },
      { title: 'DropdownMenu', slug: 'docs/ui/components/dropdown-menu' },
      { title: 'Icon', slug: 'docs/ui/components/icon' },
      { title: 'IconButton', slug: 'docs/ui/components/icon-button' },
      { title: 'IconRenderer', slug: 'docs/ui/components/icon-renderer' },
      {
        title: 'InvisibleTextField',
        slug: 'docs/ui/components/invisible-text-field',
      },
      {
        title: 'KeyboardShortcut',
        slug: 'docs/ui/components/keyboard-shortcut',
      },
      { title: 'Menu', slug: 'docs/ui/components/menu' },
      { title: 'NavGroup', slug: 'docs/ui/components/nav-group' },
      { title: 'Popover', slug: 'docs/ui/components/popover' },
      { title: 'PrimaryNavItem', slug: 'docs/ui/components/primary-nav-item' },
      {
        title: 'SecondaryNavItem',
        slug: 'docs/ui/components/secondary-nav-item',
      },
      { title: 'Separator', slug: 'docs/ui/components/separator' },
      { title: 'Sidebar', slug: 'docs/ui/components/sidebar' },
      { title: 'Tag', slug: 'docs/ui/components/tag' },
      { title: 'Text', slug: 'docs/ui/components/text' },
      { title: 'Toolbar', slug: 'docs/ui/components/toolbar' },
      { title: 'Tooltip', slug: 'docs/ui/components/tooltip' },
      { title: 'TopicNavItem', slug: 'docs/ui/components/topic-nav-item' },
      // TEMPLATE_APPEND
    ],
  },

  {
    label: 'Utilities',
    pages: [
      {
        title: 'Accessible Icon',
        slug: 'docs/ui/utilities/accessible-icon',
      },
      {
        title: 'Map props to classes',
        slug: 'docs/ui/utilities/map-props-to-classes',
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

export const allUiRoutes = uiRoutes.reduce(
  (acc, curr: RouteProps) => [
    ...acc,
    ...curr.pages.filter((p) => p.draft !== true),
  ],
  [],
);
