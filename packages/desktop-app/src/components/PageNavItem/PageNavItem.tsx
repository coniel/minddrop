import { PageNavItem as PageNavItemPrimitive } from '@minddrop/ui';
import { Page, useChildPages } from '@minddrop/pages';
import { PageNavItemIcon } from '../PageNavItemIcon';
import { useToggle } from '@minddrop/utils';

export interface PageNavItemProps {
  /**
   * The page.
   */
  page: Page;

  /**
   * The nav item level, if nested inside another
   * PageNavItem.
   */
  level?: number;
}

export const PageNavItem: React.FC<PageNavItemProps> = ({
  page,
  level = 0,
  ...other
}) => {
  const childPages = useChildPages(page.path);
  const [showIconSelection, toggleShowIconSelection, setShowIconSelection] =
    useToggle(false);

  return (
    <PageNavItemPrimitive
      level={level}
      hasSubpages={childPages.length > 0}
      label={page.title}
      icon={
        <PageNavItemIcon
          page={page}
          showIconSelection={showIconSelection}
          onShowIconSelectionChange={setShowIconSelection}
        />
      }
      {...other}
    >
      {childPages.map((childPage) => (
        <PageNavItem key={childPage.path} level={level + 1} page={childPage} />
      ))}
    </PageNavItemPrimitive>
  );
};
