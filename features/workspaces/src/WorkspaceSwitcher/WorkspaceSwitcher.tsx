import { useCallback, useState } from 'react';
import { Events } from '@minddrop/events';
import { TranslationKey } from '@minddrop/i18n';
import {
  SortableItemRenderProps,
  SortableList,
} from '@minddrop/ui-drag-and-drop';
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
 * Renders the sidebar's workspace bar: a sortable icon button per
 * workspace with the active one marked, alongside the menu for adding
 * another.
 */
export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  className,
}) => {
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const workspaces = Workspaces.useAll();
  const activeWorkspace = Workspaces.useActive();
  const openWorkspaceFolder = useOpenWorkspaceFolder({ onError: reportError });

  const startCreatingWorkspace = useCallback(() => {
    setCreatingWorkspace(true);
  }, []);

  const stopCreatingWorkspace = useCallback(() => {
    setCreatingWorkspace(false);
  }, []);

  function renderWorkspaceButton(
    id: string,
    sortable: SortableItemRenderProps,
  ) {
    const workspace = workspaces.find((workspace) => workspace.id === id);

    if (!workspace) {
      return null;
    }

    return (
      <WorkspaceButton
        key={workspace.id}
        workspace={workspace}
        active={workspace.id === activeWorkspace?.id}
        removable={workspaces.length > 1}
        sortable={sortable}
      />
    );
  }

  return (
    <>
      <Toolbar className={propsToClass('workspace-switcher', { className })}>
        {/* Balances the actions, keeping the workspaces centered */}
        <div className="workspace-switcher-side" />
        <SortableList
          className="workspace-switcher-workspaces"
          items={workspaces.map((workspace) => workspace.id)}
          direction="horizontal"
          gap={1}
          onSort={Workspaces.reorder}
          renderItem={renderWorkspaceButton}
        />
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
