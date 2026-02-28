import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconButton, NumberField } from '@minddrop/ui-primitives';
import { ContainerElementStyle } from '@minddrop/designs';
import {
  updateElementStyle,
  useDesignStudioStore,
} from '../../../DesignStudioStore';

export interface PaddingFieldsProps {
  elementId: string;
}

const sides = [
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
] as const;

type SideKey = (typeof sides)[number];

export const PaddingFields = ({ elementId }: PaddingFieldsProps) => {
  // Read all 4 padding values from the store (stored as rem, displayed as px)
  const values = useDesignStudioStore((state) => {
    const style = state.elements[elementId].style as ContainerElementStyle;

    return {
      paddingTop: Math.round(style.paddingTop * 16),
      paddingRight: Math.round(style.paddingRight * 16),
      paddingBottom: Math.round(style.paddingBottom * 16),
      paddingLeft: Math.round(style.paddingLeft * 16),
    };
  });

  // Check whether all 4 values are equal
  const allEqual = useMemo(() => {
    const first = values.paddingTop;

    return sides.every((side) => values[side] === first);
  }, [values]);

  const [synced, setSynced] = useState(allEqual);

  // Auto-enable sync when all values become equal
  useEffect(() => {
    if (allEqual) {
      setSynced(true);
    }
  }, [allEqual]);

  // Handles a value change, converting px to rem and syncing all sides if linked
  const handleChange = useCallback(
    (side: SideKey, value: number | null) => {
      if (value === null) {
        return;
      }

      const remValue = value / 16;

      if (synced) {
        sides.forEach((key) => {
          updateElementStyle(elementId, key, remValue);
        });
      } else {
        updateElementStyle(elementId, side, remValue);
      }
    },
    [elementId, synced],
  );

  // Toggles sync mode, equalising all sides when enabling
  const handleToggleSync = useCallback(() => {
    if (synced) {
      setSynced(false);
    } else {
      const remValue = values.paddingTop / 16;

      sides.forEach((key) => {
        updateElementStyle(elementId, key, remValue);
      });
      setSynced(true);
    }
  }, [elementId, synced, values.paddingTop]);

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
          value={values.paddingTop}
          onValueChange={(value) => handleChange('paddingTop', value)}
          min={0}
          max={100}
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
            value={values.paddingLeft}
            onValueChange={(value) => handleChange('paddingLeft', value)}
            min={0}
            max={100}
            step={1}
            trailing="px"
          />
        </div>
        <IconButton
          icon={synced ? 'link' : 'unlink'}
          label="designs.padding.sync"
          variant="subtle"
          size="md"
          color={synced ? 'regular' : 'muted'}
          onClick={handleToggleSync}
        />
        <div style={fieldStyle}>
          <NumberField
            variant="subtle"
            size="md"
            value={values.paddingRight}
            onValueChange={(value) => handleChange('paddingRight', value)}
            min={0}
            max={100}
            step={1}
            trailing="px"
          />
        </div>
      </div>
      <div style={fieldStyle}>
        <NumberField
          variant="subtle"
          size="md"
          value={values.paddingBottom}
          onValueChange={(value) => handleChange('paddingBottom', value)}
          min={0}
          max={100}
          step={1}
          trailing="px"
        />
      </div>
    </div>
  );
};
