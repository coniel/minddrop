import { useChildPages } from '@minddrop/pages';
import { ContentListItem, ContentListItemProps } from '@minddrop/ui';
import { useCreateCallback } from '@minddrop/utils';
import { useWorkspace } from '@minddrop/workspaces';
import { NavItemIcon } from '../NavItemIcon';
import { ContentPickerPageItem } from './ContentPickerPageItem';

export interface ContentPickerWorkspaceItemProps
  extends Pick<ContentListItemProps, 'level'> {
  /**
   * The workspace path.
   */
  path: string;

  /**
   * Callback fired when the workspace or one of its pages
   * is selected.
   */
  onClick(path: string): void;

  /**
   * Path of a page to omit from child pages.
   */
  omitPage?: string;
}

export const ContentPickerWorkspaceItem: React.FC<
  ContentPickerWorkspaceItemProps
> = ({ path, onClick, omitPage }) => {
  const workspace = useWorkspace(path);
  const pages = useChildPages(path).filter((page) => page.path !== omitPage);

  const handleClick = useCreateCallback(onClick, path);

  if (!workspace) {
    return null;
  }

  return (
    <ContentListItem
      hasChildren={!!pages.length}
      label={workspace.name}
      onClick={handleClick}
      icon={<NavItemIcon icon={workspace.icon} defaultIcon="folder" />}
    >
      {pages.map((page) => (
        <ContentPickerPageItem
          key={page.path}
          level={1}
          path={page.path}
          omitSubpage={omitPage}
          onClick={onClick}
        />
      ))}
    </ContentListItem>
  );
};
