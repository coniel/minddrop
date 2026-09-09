import { useCallback } from 'react';
import { Events } from '@minddrop/events';
import {
  DropdownMenuItem,
  MenuRenameItem,
  MenuSeparator,
} from '@minddrop/ui-primitives';
import { Workspace, Workspaces } from '@minddrop/workspaces';

export interface WorkspaceOptionsMenuContentProps {
  /**
   * The workspace the options apply to.
   */
  workspace: Workspace;

  /**
   * Whether the workspace can be removed. The app needs a workspace
   * to run on, so the last remaining one stays put.
   */
  removable: boolean;
}

/**
 * Renders the items of a workspace's options menu: renaming it and
 * picking its icon, removing it from the workspace list and deleting
 * it from disk. Rendered inside a menu content of the caller's
 * choosing, so the same items serve a dropdown and a context menu.
 */
export const WorkspaceOptionsMenuContent: React.FC<
  WorkspaceOptionsMenuContentProps
> = ({ workspace, removable }) => {
  const handleRename = useCallback(
    (name: string) => {
      Workspaces.rename(workspace.id, name);
    },
    [workspace.id],
  );

  const handleSelectIcon = useCallback(
    (icon: string) => {
      Workspaces.update(workspace.id, { icon });
    },
    [workspace.id],
  );

  const handleClearIcon = useCallback(() => {
    Workspaces.update(workspace.id, {
      icon: Workspaces.constants.EntityDefaultIcon,
    });
  }, [workspace.id]);

  // Confirm before dropping the workspace from the list
  function handleRemove() {
    Events.dispatch(Events.events.OpenConfirmationDialog, {
      title: 'workspaces.actions.remove.confirmation.title',
      message: 'workspaces.actions.remove.confirmation.message',
      confirmLabel: 'workspaces.actions.remove.confirmation.confirm',
      danger: false,
      onConfirm: () => {
        Workspaces.remove(workspace.id);
      },
    });
  }

  // Confirm before deleting the workspace directory
  function handleDelete() {
    Events.dispatch(Events.events.OpenConfirmationDialog, {
      title: 'workspaces.actions.delete.confirmation.title',
      message: 'workspaces.actions.delete.confirmation.message',
      confirmLabel: 'workspaces.actions.delete.confirmation.confirm',
      onConfirm: () => {
        Workspaces.delete(workspace.id);
      },
    });
  }

  return (
    <>
      <MenuRenameItem
        value={workspace.name}
        contentIcon={workspace.icon}
        onValueChange={() => {}}
        onRename={handleRename}
        onSelectIcon={handleSelectIcon}
        onClearIcon={handleClearIcon}
      />
      <MenuSeparator />
      <DropdownMenuItem
        icon="circle-minus"
        label="workspaces.actions.remove.label"
        tooltip={{ title: 'workspaces.actions.remove.description' }}
        disabled={!removable}
        onSelect={handleRemove}
      />
      <DropdownMenuItem
        danger
        icon="trash-2"
        label="workspaces.actions.delete.label"
        tooltip={{ title: 'workspaces.actions.delete.description' }}
        disabled={!removable}
        onSelect={handleDelete}
      />
    </>
  );
};
