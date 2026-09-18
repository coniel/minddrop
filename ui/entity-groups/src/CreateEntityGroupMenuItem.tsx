import { EntityGroups } from '@minddrop/entity-groups';
import { TranslationKey } from '@minddrop/i18n';
import { DropdownMenuItem } from '@minddrop/ui-primitives';

export interface CreateEntityGroupMenuItemProps {
  /**
   * Called when the action is selected, to open the popover naming
   * the group.
   */
  onSelect: () => void;

  /**
   * The action's label.
   *
   * @default 'entityGroups.labels.newGroup'
   */
  label?: TranslationKey;
}

/**
 * Renders the menu action which makes a new group, to place among a
 * creation menu's own actions.
 */
export const CreateEntityGroupMenuItem: React.FC<
  CreateEntityGroupMenuItemProps
> = ({ onSelect, label = 'entityGroups.labels.newGroup' }) => (
  <DropdownMenuItem
    icon={EntityGroups.constants.NewIcon}
    label={label}
    onSelect={onSelect}
  />
);
