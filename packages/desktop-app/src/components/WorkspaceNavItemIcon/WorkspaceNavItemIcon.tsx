import { useCallback, useEffect } from 'react';
import { ContentColor } from '@minddrop/core';
import { ContentIconName, EmojiSkinTone, useIcon } from '@minddrop/icons';
import { NavItemIcon } from '@minddrop/ui-desktop';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@minddrop/ui-elements';
import { useCreateCallback, useToggle } from '@minddrop/utils';
import { DefaultWorkspaceIcon, Workspace } from '@minddrop/workspaces';
import {
  clearWorkspaceIcon,
  setWorkspaceContentIcon,
  setWorkspaceContentIconColor,
  setWorkspaceEmoji,
} from '../../api';
import { IconPicker } from '../IconPicker';

export interface WorkspaceNavItemIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the NavItemIcon.
   */
  children?: React.ReactNode;
}

export const WorkspaceNavItemIcon: React.FC<{
  workspace: Workspace;
  showIconSelection: boolean;
  onShowIconSelectionChange(value: boolean): void;
}> = ({ showIconSelection = false, onShowIconSelectionChange, workspace }) => {
  const { icon, color, skinTone } = useIcon(
    workspace.icon,
    DefaultWorkspaceIcon,
  );

  const [pickerPopoverOpen, _, setPickerPopoverOpen] =
    useToggle(showIconSelection);

  useEffect(() => {
    setPickerPopoverOpen(showIconSelection);
  }, [setPickerPopoverOpen, showIconSelection]);

  const handleClear = useCreateCallback(clearWorkspaceIcon, workspace.path);

  const handleShowIconSelectionChange = useCallback(
    (value: boolean) => {
      onShowIconSelectionChange(value);
      setPickerPopoverOpen(value);
    },
    [onShowIconSelectionChange, setPickerPopoverOpen],
  );

  const handleSelectContentIcon = useCallback(
    (icon: ContentIconName, color: ContentColor) =>
      setWorkspaceContentIcon(workspace.path, icon, color),
    [workspace.path],
  );

  const handleSelectIconColor = useCallback(
    (color: ContentColor) => setWorkspaceContentIconColor(workspace, color),
    [workspace],
  );

  const handleSelectEmoji = useCallback(
    (emoji: string, skinTone: EmojiSkinTone) =>
      setWorkspaceEmoji(workspace.path, emoji, skinTone),
    [workspace.path],
  );

  return (
    <Popover
      open={pickerPopoverOpen}
      onOpenChange={handleShowIconSelectionChange}
    >
      <PopoverTrigger asChild>
        <NavItemIcon defaultIcon={DefaultWorkspaceIcon} icon={workspace.icon} />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          style={{ borderRadius: 8 }}
          side="top"
          sideOffset={4}
          collisionPadding={{ left: 14 }}
        >
          <IconPicker
            defaultPicker={icon.type}
            defaultIconColor={color}
            defaultEmojiSkinTone={skinTone}
            onClear={handleClear}
            onSelectIcon={handleSelectContentIcon}
            onSelectIconColor={handleSelectIconColor}
            onSelectEmoji={handleSelectEmoji}
          />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};
