import { useEffect, useState } from 'react';
import {
  Anchor,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  TextInput,
} from '@minddrop/ui-primitives';

export interface EntityGroupNamePopoverProps {
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
  anchor?: Anchor;

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
 * Renders an anchored popover containing a group name field,
 * committed with Enter. Used both for naming a new group and for
 * renaming an existing one.
 */
export const EntityGroupNamePopover: React.FC<EntityGroupNamePopoverProps> = ({
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
          <PopoverContent className="entity-group-name-popover">
            <TextInput
              autoFocus
              unassisted
              size="md"
              variant="ghost"
              placeholder="entityGroups.name.placeholder"
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
