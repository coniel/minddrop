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
import { useChildDocuments } from '@minddrop/documents';
import { DocumentNavItem } from '../DocumentNavItem';
import { useCallback } from 'react';
import { createDocument } from '../../api/createDocument';

interface WorkspaceNavItemProps {
  /**
   * The workspace.
   */
  workspace: Workspace;
}

export const WorkspaceNavItem: React.FC<WorkspaceNavItemProps> = ({
  workspace,
}) => {
  const documents = useChildDocuments(workspace.path);
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

  const handleClickAddDocument = useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      await createDocument(workspace.path, 'board');
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
                  label="Add a document inside"
                  size="small"
                  icon="plus"
                  onClick={handleClickAddDocument}
                />
              </div>
            }
          >
            {documents.map((document) => (
              <DocumentNavItem key={document.path} document={document} />
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
