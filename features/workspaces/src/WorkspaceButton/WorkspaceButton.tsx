import { useState } from 'react';
import {
  ContentIcon,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  ToolbarIconButton,
  propsToClass,
} from '@minddrop/ui-primitives';
import { Workspace, Workspaces } from '@minddrop/workspaces';
import { WorkspaceOptionsMenuContent } from '../WorkspaceOptionsMenuContent';
import './WorkspaceButton.css';

export interface WorkspaceButtonProps {
  /**
   * The workspace the button represents.
   */
  workspace: Workspace;

  /**
   * Whether the workspace is the active one.
   */
  active: boolean;

  /**
   * Whether the workspace can be removed.
   */
  removable: boolean;
}

/**
 * Renders a workspace's icon button, which switches to the workspace
 * and opens its options on right click. The active workspace has
 * nothing to switch to, so its button opens the options either way.
 *
 * Built on the anchored menu primitive rather than the dropdown's:
 * the dropdown expects the button to be its trigger, which would open
 * the menu on every left click and leave no way to switch workspace.
 */
export const WorkspaceButton: React.FC<WorkspaceButtonProps> = ({
  workspace,
  active,
  removable,
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function openMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchor(event.currentTarget);
    setMenuOpen(true);
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (active) {
      openMenu(event);

      return;
    }

    Workspaces.setActive(workspace.id);
  }

  function handleContextMenu(event: React.MouseEvent<HTMLButtonElement>) {
    // Suppress the native context menu
    event.preventDefault();

    openMenu(event);
  }

  return (
    <ContextMenuRoot open={menuOpen} onOpenChange={setMenuOpen}>
      <ToolbarIconButton
        aria-current={active}
        className={propsToClass('workspace-button', { inactive: !active })}
        stringLabel={workspace.name}
        tooltip={{ stringTitle: workspace.name }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <ContentIcon icon={workspace.icon} />
      </ToolbarIconButton>
      <ContextMenuPortal>
        <ContextMenuPositioner anchor={anchor} side="top" align="start">
          <ContextMenuContent minWidth={220}>
            <WorkspaceOptionsMenuContent
              workspace={workspace}
              removable={removable}
            />
          </ContextMenuContent>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextMenuRoot>
  );
};
