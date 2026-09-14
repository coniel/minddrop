import { TranslationKey } from '@minddrop/i18n';
import { ContentColor } from '@minddrop/ui-theme';
import { ContentColorSwatch } from '../ContentColorSwatch';
import { ContentIcon } from '../ContentIcon';
import { DropdownMenu, DropdownMenuColorSelectionItem } from '../DropdownMenu';
import { IconButton } from '../IconButton';
import { IconPicker } from '../IconPicker';
import { Group, Stack } from '../Layout';
import { useKeepMenuFocus } from '../Menu/MenuFocusContext';
import { Text } from '../Text';
import { ContentColorValues } from '../constants';
import { TextInput } from '../fields/TextInput';
import { propsToClass } from '../utils';
import './NameForm.css';

export interface NameFormProps {
  /**
   * The name in the field.
   */
  value: string;

  /**
   * Callback fired when the name in the field changes.
   */
  onValueChange: (value: string) => void;

  /**
   * Placeholder shown while the field is empty.
   */
  placeholder?: TranslationKey;

  /**
   * Callback fired with the trimmed name when it is committed.
   */
  onSubmit: (name: string) => void;

  /**
   * The stringified content icon shown beside the field. Given
   * alongside `onIconChange` for a form which picks an icon.
   */
  icon?: string;

  /**
   * Callback fired with the picked icon, and with null when the
   * icon is cleared.
   */
  onIconChange?: (icon: string | null) => void;

  /**
   * The colour shown beside the field. Given alongside
   * `onColorChange` for a form which picks a colour.
   */
  color?: ContentColor;

  /**
   * Callback fired with the picked colour.
   */
  onColorChange?: (color: ContentColor) => void;

  /**
   * Message shown below the field, e.g. when the name is taken.
   */
  error?: TranslationKey;

  /**
   * Accessible label of the button which picks the icon.
   * @default 'actions.pickIcon'
   */
  iconLabel?: TranslationKey;

  /**
   * Accessible label of the button which picks the colour.
   * @default 'actions.pickColor'
   */
  colorLabel?: TranslationKey;

  /**
   * Accessible label of the button which commits the name.
   * @default 'actions.save'
   */
  submitLabel?: TranslationKey;

  /**
   * Class name applied to the form.
   */
  className?: string;
}

/**
 * Renders a row naming something: a name field committed with
 * Enter or the check button beside it, and optionally an icon or a
 * colour picked alongside it.
 *
 * A picked icon or colour is a decision of its own and applies as
 * it is picked. A name is not one until it is finished, so it waits
 * to be committed, and a blank one commits nothing.
 *
 * Inside a menu, keeps the menu's focus and its keys: hovering the
 * menu's items does not take the focus from the field, and what is
 * typed reaches the field rather than the menu's typeahead.
 */
export const NameForm: React.FC<NameFormProps> = ({
  value,
  onValueChange,
  placeholder,
  onSubmit,
  icon,
  onIconChange,
  color,
  onColorChange,
  error,
  iconLabel = 'actions.pickIcon',
  colorLabel = 'actions.pickColor',
  submitLabel = 'actions.save',
  className,
}) => {
  useKeepMenuFocus();

  // Hand the name over, which the key and the check button both
  // do, unless it is blank.
  function handleCommit() {
    const trimmedName = value.trim();

    if (!trimmedName) {
      return;
    }

    onSubmit(trimmedName);
  }

  // A menu cancels the character keys its popup sees, for its
  // typeahead, so they stop here. Every other key goes on, since the
  // popup is what closes on Escape.
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key.length === 1) {
      event.stopPropagation();
    }
  }

  return (
    <Stack
      gap={1}
      className={propsToClass('name-form', { className })}
      onKeyDown={handleKeyDown}
    >
      <Group gap={1}>
        {onIconChange && (
          <IconPicker
            closeOnSelect
            currentIcon={icon}
            onSelect={onIconChange}
            onClear={() => onIconChange(null)}
          >
            <IconButton
              size="md"
              variant="ghost"
              color="neutral"
              label={iconLabel}
            >
              <ContentIcon icon={icon} />
            </IconButton>
          </IconPicker>
        )}

        {onColorChange && (
          <DropdownMenu
            trigger={
              <IconButton
                size="md"
                variant="ghost"
                color="neutral"
                label={colorLabel}
              >
                <ContentColorSwatch
                  color={color ?? 'default'}
                  unset={(color ?? 'default') === 'default'}
                />
              </IconButton>
            }
          >
            {ContentColorValues.map((option) => (
              <DropdownMenuColorSelectionItem
                key={option.value}
                color={option.value}
                checked={option.value === (color ?? 'default')}
                onClick={() => onColorChange(option.value)}
              />
            ))}
          </DropdownMenu>
        )}

        <TextInput
          autoFocus
          unassisted
          size="md"
          variant="ghost"
          className="name-form-field"
          placeholder={placeholder}
          value={value}
          onValueChange={onValueChange}
          onCommit={handleCommit}
        />

        <IconButton
          icon="check"
          size="md"
          variant="ghost"
          color="neutral"
          label={submitLabel}
          onClick={handleCommit}
        />
      </Group>

      {/* What makes the name unacceptable is the consumer's to say */}
      {error && (
        <Text
          block
          size="sm"
          color="danger"
          className="name-form-error"
          text={error}
        />
      )}
    </Stack>
  );
};
