import { useCallback, useMemo, useState } from 'react';
import { Events } from '@minddrop/events';
import { TranslationKey } from '@minddrop/i18n';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  IconButton,
  Toolbar,
  propsToClass,
} from '@minddrop/ui-primitives';
import { useOpenWorkspaceFolder } from '@minddrop/ui-workspaces';
import { Workspaces } from '@minddrop/workspaces';
import { CreateWorkspaceDialog } from '../CreateWorkspaceDialog';
import { WorkspaceButton } from '../WorkspaceButton';
import './WorkspaceSwitcher.css';

export interface WorkspaceSwitcherProps {
  /**
   * Class name applied to the root toolbar.
   */
  className?: string;
}

/**
 * Renders the sidebar's workspace bar: an icon button per workspace
 * with the active one marked, alongside the menu for adding another.
 */
export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  className,
}) => {
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const workspaces = Workspaces.useAll();
  const activeWorkspace = Workspaces.useActive();
  const openWorkspaceFolder = useOpenWorkspaceFolder({ onError: reportError });

  const sortedWorkspaces = useMemo(
    () => [...workspaces].sort((a, b) => a.name.localeCompare(b.name)),
    [workspaces],
  );

  const startCreatingWorkspace = useCallback(() => {
    setCreatingWorkspace(true);
  }, []);

  const stopCreatingWorkspace = useCallback(() => {
    setCreatingWorkspace(false);
  }, []);

  return (
    <>
      <Toolbar className={propsToClass('workspace-switcher', { className })}>
        {/* Balances the actions, keeping the workspaces centered */}
        <div className="workspace-switcher-side" />
        <div className="workspace-switcher-workspaces">
          {sortedWorkspaces.map((workspace) => (
            <WorkspaceButton
              key={workspace.id}
              workspace={workspace}
              active={workspace.id === activeWorkspace?.id}
              removable={sortedWorkspaces.length > 1}
            />
          ))}
        </div>
        <div className="workspace-switcher-side workspace-switcher-actions">
          <DropdownMenu
            side="top"
            align="end"
            minWidth={220}
            trigger={
              <IconButton icon="plus" label="workspaces.switcher.actions.add" />
            }
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                icon="folder-plus"
                label="workspaces.switcher.actions.create"
                onSelect={startCreatingWorkspace}
              />
              <DropdownMenuItem
                icon="folder-open"
                label="workspaces.switcher.actions.open"
                onSelect={openWorkspaceFolder}
              />
            </DropdownMenuGroup>
          </DropdownMenu>
        </div>
      </Toolbar>
      <CreateWorkspaceDialog
        open={creatingWorkspace}
        onClose={stopCreatingWorkspace}
      />
    </>
  );
};

/**
 * Reports a failure to open a workspace folder to the user.
 */
function reportError(message: TranslationKey) {
  Events.dispatch(Events.events.AppError, { message });
}
