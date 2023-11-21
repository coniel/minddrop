import {
  WorkspaceNavItem as BaseWorkspaceNavItem,
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverPortal,
} from '@minddrop/ui';
import { Workspace, Workspaces } from '@minddrop/workspaces';
import { useCreateCallback, useToggle } from '@minddrop/utils';
import { RenameWorkspacePopover } from '../RenameWorkspacePopover';
import { WorkspaceOptionsMenu } from '../WorkspaceOptionsMenu';
import { promptMoveWorkspace, revealInFileExplorer } from '../../api';
import { WorkspaceNavItemIcon } from '../WorkspaceNavItemIcon';
import { useChildPages } from '@minddrop/pages';
import { PageNavItem } from '../PageNavItem';
import { useCallback } from 'react';
import { createPage } from '../../api/createPage';

interface WorkspaceNavItemProps {
  /**
   * The workspace.
   */
  workspace: Workspace;
}

export const WorkspaceNavItem: React.FC<WorkspaceNavItemProps> = ({
  workspace,
}) => {
  const pages = useChildPages(workspace.path);
  const [hovering, toggleHovering] = useToggle(false);
  const [renamePopoverOpen, toggleRenamePopover] = useToggle(false);
  const [iconPopoverOpen, toggle, setIconPopoverOpen] = useToggle(false);
  const handleMove = useCreateCallback(promptMoveWorkspace, workspace.path);
  const handleRemove = useCreateCallback(Workspaces.remove, workspace.path);
  const handleDelete = useCreateCallback(Workspaces.delete, workspace.path);
  const handleRevealInFileExplorer = useCreateCallback(
    revealInFileExplorer,
    workspace.path,
  );

  const handleClickAddPage = useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      await createPage(workspace.path);
    },
    [workspace.path],
  );

  return (
    <div style={{ position: 'relative' }}>
      <Popover open={renamePopoverOpen} onOpenChange={() => {}}>
        <PopoverAnchor>
          <BaseWorkspaceNavItem
            hovering={hovering}
            key={workspace.path}
            label={workspace.name}
            icon={
              <WorkspaceNavItemIcon
                workspace={workspace}
                showIconSelection={iconPopoverOpen}
                onShowIconSelectionChange={setIconPopoverOpen}
              />
            }
            actions={
              <div style={{ columnGap: 2, display: 'flex' }}>
                <WorkspaceOptionsMenu
                  path={workspace.path}
                  onOpenChange={toggleHovering}
                  onSelectRename={toggleRenamePopover}
                  onSelectChangeIcon={toggle}
                  onSelectMove={handleMove}
                  onSelectRemove={handleRemove}
                  onSelectDelete={handleDelete}
                  onSelectRevealInFileExplorer={handleRevealInFileExplorer}
                >
                  <IconButton
                    label="Workspace options"
                    size="small"
                    icon="more-vertical"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  />
                </WorkspaceOptionsMenu>
                <IconButton
                  label="Add a page inside"
                  size="small"
                  icon="plus"
                  onClick={handleClickAddPage}
                />
              </div>
            }
          >
            {pages.map((page) => (
              <PageNavItem key={page.path} page={page} />
            ))}
          </BaseWorkspaceNavItem>
        </PopoverAnchor>
        <PopoverPortal>
          <RenameWorkspacePopover
            workspace={workspace}
            onClose={toggleRenamePopover}
          />
        </PopoverPortal>
      </Popover>
    </div>
  );
};
