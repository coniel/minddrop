import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconButton, NumberField } from '@minddrop/ui-primitives';
import { TypographyStyles } from '@minddrop/designs';
import {
  updateElementStyle,
  useDesignStudioStore,
} from '../../../DesignStudioStore';

export interface MarginFieldsProps {
  elementId: string;
}

const sides = [
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
] as const;

type SideKey = (typeof sides)[number];

export const MarginFields = ({ elementId }: MarginFieldsProps) => {
  // Read all 4 margin values from the store (stored as rem, displayed as px)
  const values = useDesignStudioStore((state) => {
    const style = state.elements[elementId].style as TypographyStyles;

    return {
      'margin-top': Math.round(style['margin-top'] * 16),
      'margin-right': Math.round(style['margin-right'] * 16),
      'margin-bottom': Math.round(style['margin-bottom'] * 16),
      'margin-left': Math.round(style['margin-left'] * 16),
    };
  });

  // Check whether all 4 values are equal
  const allEqual = useMemo(() => {
    const first = values['margin-top'];

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
      const remValue = values['margin-top'] / 16;

      sides.forEach((key) => {
        updateElementStyle(elementId, key, remValue);
      });
      setSynced(true);
    }
  }, [elementId, synced, values]);

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
          value={values['margin-top']}
          onValueChange={(value) => handleChange('margin-top', value)}
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
            value={values['margin-left']}
            onValueChange={(value) => handleChange('margin-left', value)}
            step={1}
            trailing="px"
          />
        </div>
        <IconButton
          icon={synced ? 'link' : 'unlink'}
          label="designs.typography.margin.sync"
          variant="subtle"
          size="md"
          color={synced ? 'regular' : 'muted'}
          onClick={handleToggleSync}
        />
        <div style={fieldStyle}>
          <NumberField
            variant="subtle"
            size="md"
            value={values['margin-right']}
            onValueChange={(value) => handleChange('margin-right', value)}
            step={1}
            trailing="px"
          />
        </div>
      </div>
      <div style={fieldStyle}>
        <NumberField
          variant="subtle"
          size="md"
          value={values['margin-bottom']}
          onValueChange={(value) => handleChange('margin-bottom', value)}
          step={1}
          trailing="px"
        />
      </div>
    </div>
  );
};
