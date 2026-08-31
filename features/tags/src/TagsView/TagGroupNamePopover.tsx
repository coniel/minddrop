import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  TextInput,
} from '@minddrop/ui-primitives';

export interface TagGroupNamePopoverProps {
  /**
   * Whether the popover is open.
   */
  open: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The element the popover is anchored to.
   */
  anchor?: PopoverPositionerProps['anchor'];

  /**
   * The initial value of the name field.
   */
  defaultName?: string;

  /**
   * Callback fired with the trimmed name when committed.
   */
  onSubmit: (name: string) => void;
}

/**
 * Renders an anchored popover containing a tag group name field,
 * committed with Enter. Used for both naming a new group and
 * renaming an existing one.
 */
export const TagGroupNamePopover: React.FC<TagGroupNamePopoverProps> = ({
  open,
  onOpenChange,
  anchor,
  defaultName = '',
  onSubmit,
}) => {
  const [name, setName] = useState(defaultName);

  // Reset the field for the next naming when opened
  useEffect(() => {
    if (open) {
      setName(defaultName);
    }
  }, [open, defaultName]);

  // Commit the name on Enter, ignoring blank names
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return;
    }

    const trimmedName = name.trim();

    // Blank names are not committed
    if (!trimmedName) {
      return;
    }

    onSubmit(trimmedName);
    onOpenChange(false);
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverPortal>
        <PopoverPositioner side="bottom" align="start" anchor={anchor}>
          <PopoverContent className="tag-group-name-popover">
            <TextInput
              autoFocus
              unassisted
              size="md"
              variant="ghost"
              placeholder="tags.groupName.placeholder"
              value={name}
              onValueChange={setName}
              onKeyDown={handleKeyDown}
            />
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
