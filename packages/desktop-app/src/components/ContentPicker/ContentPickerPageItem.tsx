import { useChildPages, usePage } from '@minddrop/pages';
import { ContentListItem, ContentListItemProps } from '@minddrop/ui';
import { useCreateCallback } from '@minddrop/utils';
import { NavItemIcon } from '../NavItemIcon';

export interface ContentPickerPageItemProps
  extends Pick<ContentListItemProps, 'level'> {
  /**
   * The page path.
   */
  path: string;

  /**
   * Callback fired when the page is selected.
   */
  onClick(path: string): void;

  /**
   * Path of a subpage to omit from child pages.
   */
  omitSubpage?: string;
}

export const ContentPickerPageItem: React.FC<ContentPickerPageItemProps> = ({
  path,
  omitSubpage,
  onClick,
  level = 0,
}) => {
  const page = usePage(path);
  // Get the page's child pages, except for possible
  // omitted one.
  const subpages = useChildPages(path).filter(
    (subpage) => subpage.path !== omitSubpage,
  );

  const handleClick = useCreateCallback(onClick, path);

  if (!page) {
    return null;
  }

  return (
    <ContentListItem
      hasChildren={!!subpages.length}
      level={level}
      label={page.title}
      onClick={handleClick}
      icon={
        <NavItemIcon icon={page.icon} defaultIcon="file-text" color="light" />
      }
    >
      {subpages.map((subpage) => (
        <ContentPickerPageItem
          key={subpage.path}
          level={level + 1}
          path={subpage.path}
          omitSubpage={omitSubpage}
          onClick={onClick}
        />
      ))}
    </ContentListItem>
  );
};
