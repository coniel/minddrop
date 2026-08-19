import { useState } from 'react';
import { SpaceToken } from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { InputLabel, SelectOption, Stack } from '@minddrop/ui-primitives';
import { CrossSide, SideSelectCross } from './SideSelectCross';
import { SpaceField, SpaceScaleTokens } from './SpaceField';
import { fieldLabelKey, spaceOptionKey } from './styleI18nKeys';

/**
 * A single side of a margin or padding block.
 */
export interface SpaceSide {
  /**
   * The style key the side writes to.
   */
  key: string;

  /**
   * The i18n key of the side's label.
   */
  label: TranslationKey;
}

// Value used by the option which clears a side, since a select
// cannot carry undefined as an option value
const NoneValue = 'none';

// The options each side select offers: the spacing scale plus the
// option which clears the side
const SpaceOptions: SelectOption<string>[] = [
  { value: NoneValue, label: 'designsStudio.style.space.none' },
  ...SpaceScaleTokens.map((token) => ({
    value: token,
    label: spaceOptionKey(token, 'label'),
  })),
];

// The hairline-free options offered by padding blocks
const InsetOptions: SelectOption<string>[] = SpaceOptions.filter(
  (option) => option.value !== 'px',
);

export interface SpaceFieldsProps {
  /**
   * The i18n key of the block label. Omitted on blocks whose
   * section already names them.
   */
  label?: TranslationKey;

  /**
   * Whether the hairline step is offered. Padding blocks omit it.
   */
  hairline?: boolean;

  /**
   * The sides to render, already filtered of any the element's
   * role controls.
   */
  sides: SpaceSide[];

  /**
   * Reads the token currently set on a side.
   */
  getValue: (key: string) => SpaceToken | undefined;

  /**
   * Called with a side's key and its chosen token, or undefined
   * when the side is cleared.
   */
  onChange: (key: string, value: SpaceToken | undefined) => void;
}

/**
 * Renders the per-side selects of a margin or padding block,
 * arranged in a compass cross with a sync toggle. Roles can lock
 * individual sides, leaving too few for the cross, so the
 * remaining sides fall back to a stacked list.
 */
export const SpaceFields: React.FC<SpaceFieldsProps> = ({
  label,
  hairline = true,
  sides,
  getValue,
  onChange,
}) => {
  // Sides start unlinked: spacing is usually tuned per edge, so
  // linking is the deliberate choice
  const [synced, setSynced] = useState(false);

  // The whole block disappears when a role controls every side
  if (sides.length === 0) {
    return null;
  }

  // A partially locked block lists its remaining sides instead
  if (sides.length < 4) {
    return (
      <Stack gap={2}>
        {label && <InputLabel size="xs" label={label} />}
        {sides.map((side) => (
          <SpaceField
            key={side.key}
            label={side.label}
            hairline={hairline}
            value={getValue(side.key)}
            onChange={(value) => onChange(side.key, value)}
          />
        ))}
      </Stack>
    );
  }

  // The sides in cross position, from their visual order
  const [top, right, bottom, left] = sides;
  const sidesByCross: Record<CrossSide, SpaceSide> = {
    top,
    right,
    bottom,
    left,
  };

  // Resolve the value a side's select shows
  function sideValue(side: CrossSide): string {
    return getValue(sidesByCross[side].key) ?? NoneValue;
  }

  // Apply a side's pick, spreading it to every side while linked
  function handleSideChange(side: CrossSide, selected: string | number) {
    // The none option clears the side
    const value = selected === NoneValue ? undefined : (selected as SpaceToken);

    if (synced) {
      sides.forEach((syncedSide) => {
        onChange(syncedSide.key, value);
      });

      return;
    }

    onChange(sidesByCross[side].key, value);
  }

  // Link or unlink the sides, equalising them on the top side's
  // value when linking
  function handleToggleSync() {
    if (synced) {
      setSynced(false);

      return;
    }

    const value = getValue(top.key);

    sides.forEach((side) => {
      onChange(side.key, value);
    });

    setSynced(true);
  }

  return (
    <Stack gap={1}>
      {label && <InputLabel size="xs" label={label} />}
      <SideSelectCross
        options={hairline ? SpaceOptions : InsetOptions}
        values={{
          top: sideValue('top'),
          right: sideValue('right'),
          bottom: sideValue('bottom'),
          left: sideValue('left'),
        }}
        synced={synced}
        syncLabel="designsStudio.style.space.sync"
        onSideChange={handleSideChange}
        onToggleSync={handleToggleSync}
      />
    </Stack>
  );
};

/**
 * The four margin sides, in visual order.
 */
export const MarginSides: SpaceSide[] = [
  { key: 'marginTop', label: fieldLabelKey('top') },
  { key: 'marginRight', label: fieldLabelKey('right') },
  { key: 'marginBottom', label: fieldLabelKey('bottom') },
  { key: 'marginLeft', label: fieldLabelKey('left') },
];

/**
 * The four padding sides, in visual order.
 */
export const PaddingSides: SpaceSide[] = [
  { key: 'paddingTop', label: fieldLabelKey('top') },
  { key: 'paddingRight', label: fieldLabelKey('right') },
  { key: 'paddingBottom', label: fieldLabelKey('bottom') },
  { key: 'paddingLeft', label: fieldLabelKey('left') },
];

/**
 * The style keys the margin block writes to, derived from its
 * sides so the two cannot drift apart.
 */
export const MarginStyleKeys: string[] = MarginSides.map((side) => side.key);

/**
 * The style keys the padding block writes to, derived from its
 * sides so the two cannot drift apart.
 */
export const PaddingStyleKeys: string[] = PaddingSides.map((side) => side.key);
