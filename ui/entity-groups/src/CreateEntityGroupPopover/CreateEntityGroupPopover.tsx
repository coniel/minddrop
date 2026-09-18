import { EntityGroups } from '@minddrop/entity-groups';
import { NamePopover, PopoverPositionerProps } from '@minddrop/ui-primitives';
import { resolveEntityGroupNameError } from '../utils';

export interface CreateEntityGroupPopoverProps {
  /**
   * The group type the created group belongs to.
   */
  type: string;

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
}

/**
 * Renders an anchored popover naming a new group, which it creates
 * on submit.
 */
export const CreateEntityGroupPopover: React.FC<
  CreateEntityGroupPopoverProps
> = ({ type, open, onOpenChange, anchor }) => {
  // Create the group with the committed name, or show an error if
  // the name is invalid.
  async function handleSubmit(name: string) {
    try {
      await EntityGroups.create(type, name);
    } catch (error) {
      return resolveEntityGroupNameError(error);
    }
  }

  return (
    <NamePopover
      open={open}
      onOpenChange={onOpenChange}
      anchor={anchor}
      placeholder="entityGroups.name.placeholder"
      onSubmit={handleSubmit}
    />
  );
};
