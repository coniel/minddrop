import { TranslationKey } from '@minddrop/i18n';
import {
  Group,
  IconButton,
  SelectField,
  SelectOption,
  Stack,
} from '@minddrop/ui-primitives';
import './SideSelectCross.css';

/**
 * The sides of a cross, named after the edges they set.
 */
export type CrossSide = 'top' | 'right' | 'bottom' | 'left';

export interface SideSelectCrossProps {
  /**
   * The options every side select offers.
   */
  options: SelectOption<string>[];

  /**
   * The value each side select shows.
   */
  values: Record<CrossSide, string>;

  /**
   * Whether the sides are linked, deciding the sync button's look.
   */
  synced: boolean;

  /**
   * The i18n key of the sync button's label.
   */
  syncLabel: TranslationKey;

  /**
   * Called with the changed side and its chosen option value.
   */
  onSideChange: (side: CrossSide, value: string | number) => void;

  /**
   * Called when the sync button is pressed.
   */
  onToggleSync: () => void;
}

/**
 * Renders four per-side selects arranged in a compass cross with a
 * sync toggle at its centre, for style blocks setting a value per
 * edge.
 */
export const SideSelectCross: React.FC<SideSelectCrossProps> = ({
  options,
  values,
  synced,
  syncLabel,
  onSideChange,
  onToggleSync,
}) => {
  return (
    <Stack gap={1} align="center">
      <SelectField
        className="designs-side-select-cross-select"
        size="sm"
        variant="subtle"
        options={options}
        value={values.top}
        onValueChange={(value) => onSideChange('top', value)}
      />
      <Group gap={1} align="center">
        <SelectField
          className="designs-side-select-cross-select"
          size="sm"
          variant="subtle"
          options={options}
          value={values.left}
          onValueChange={(value) => onSideChange('left', value)}
        />
        <IconButton
          icon={synced ? 'link' : 'unlink'}
          label={syncLabel}
          variant="subtle"
          size="md"
          color={synced ? 'neutral' : 'muted'}
          onClick={onToggleSync}
        />
        <SelectField
          className="designs-side-select-cross-select"
          size="sm"
          variant="subtle"
          options={options}
          value={values.right}
          onValueChange={(value) => onSideChange('right', value)}
        />
      </Group>
      <SelectField
        className="designs-side-select-cross-select"
        size="sm"
        variant="subtle"
        options={options}
        value={values.bottom}
        onValueChange={(value) => onSideChange('bottom', value)}
      />
    </Stack>
  );
};
