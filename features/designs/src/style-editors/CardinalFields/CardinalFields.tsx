import { useCallback, useMemo, useState } from 'react';
import { DesignElementStyle } from '@minddrop/designs';
import { IconButton, NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useDesignStudioStore,
} from '../../DesignStudioStore';

type StyleKey = keyof DesignElementStyle;

export interface CardinalFieldsProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Style keys for top, right, bottom, left in that order.
   */
  sides: readonly [StyleKey, StyleKey, StyleKey, StyleKey];

  /**
   * i18n key for the sync toggle tooltip.
   */
  syncLabel: string;

  /**
   * Whether values are stored as rem and displayed as px.
   * When true, values are multiplied by 16 for display and
   * divided by 16 for storage. When false, values are used
   * as-is (px to px).
   * @default true
   */
  remValues?: boolean;

  /**
   * Minimum allowed value in px.
   * @default undefined (no minimum)
   */
  min?: number;

  /**
   * Maximum allowed value in px.
   * @default undefined (no maximum)
   */
  max?: number;
}

/**
 * Renders four number fields arranged in a cross layout with a sync toggle.
 */
export const CardinalFields = ({
  elementId,
  sides,
  syncLabel,
  remValues = true,
  min,
  max,
}: CardinalFieldsProps) => {
  const [top, right, bottom, left] = sides;

  // Read all 4 values from the store
  const values = useDesignStudioStore((state) => {
    const style = state.elements[elementId].style as unknown as Record<
      string,
      number
    >;

    if (remValues) {
      return {
        [top]: Math.round((style[top] ?? 0) * 16),
        [right]: Math.round((style[right] ?? 0) * 16),
        [bottom]: Math.round((style[bottom] ?? 0) * 16),
        [left]: Math.round((style[left] ?? 0) * 16),
      };
    }

    return {
      [top]: style[top] ?? 0,
      [right]: style[right] ?? 0,
      [bottom]: style[bottom] ?? 0,
      [left]: style[left] ?? 0,
    };
  });

  // Whether all 4 values are currently equal
  const allEqual = useMemo(() => {
    const first = values[top];

    return sides.every((side) => values[side] === first);
  }, [values, sides, top]);

  // Start synced if all values are equal and non-zero
  const [synced, setSynced] = useState(() => allEqual && values[top] !== 0);

  // Handles a value change, syncing all sides if linked
  const handleChange = useCallback(
    (side: StyleKey, value: number | null) => {
      if (value === null) {
        return;
      }

      const storeValue = remValues ? value / 16 : value;

      if (synced) {
        sides.forEach((key) => {
          updateElementStyle(
            elementId,
            key,
            storeValue as DesignElementStyle[typeof key],
          );
        });
      } else {
        updateElementStyle(
          elementId,
          side,
          storeValue as DesignElementStyle[typeof side],
        );
      }
    },
    [elementId, synced, sides, remValues],
  );

  // Toggles sync mode, equalising all sides when enabling
  const handleToggleSync = useCallback(() => {
    if (synced) {
      setSynced(false);
    } else {
      const storeValue = remValues ? values[top] / 16 : values[top];

      sides.forEach((key) => {
        updateElementStyle(
          elementId,
          key,
          storeValue as DesignElementStyle[typeof key],
        );
      });
      setSynced(true);
    }
  }, [elementId, synced, values, top, sides, remValues]);

  const fieldStyle = { width: 80 };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-1)',
      }}
    >
      <div style={fieldStyle}>
        <NumberField
          variant="subtle"
          size="md"
          value={values[top]}
          onValueChange={(value) => handleChange(top, value)}
          min={min}
          max={max}
          step={1}
          trailing="px"
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
        }}
      >
        <div style={fieldStyle}>
          <NumberField
            variant="subtle"
            size="md"
            value={values[left]}
            onValueChange={(value) => handleChange(left, value)}
            min={min}
            max={max}
            step={1}
            trailing="px"
          />
        </div>
        <IconButton
          icon={synced ? 'link' : 'unlink'}
          label={syncLabel}
          variant="subtle"
          size="md"
          color={synced ? 'regular' : 'muted'}
          onClick={handleToggleSync}
        />
        <div style={fieldStyle}>
          <NumberField
            variant="subtle"
            size="md"
            value={values[right]}
            onValueChange={(value) => handleChange(right, value)}
            min={min}
            max={max}
            step={1}
            trailing="px"
          />
        </div>
      </div>
      <div style={fieldStyle}>
        <NumberField
          variant="subtle"
          size="md"
          value={values[bottom]}
          onValueChange={(value) => handleChange(bottom, value)}
          min={min}
          max={max}
          step={1}
          trailing="px"
        />
      </div>
    </div>
  );
};
