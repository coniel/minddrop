import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Group,
  IconButton,
  NumberField,
} from '@minddrop/ui-primitives';
import { ContainerElementStyle } from '@minddrop/designs';
import {
  updateElementStyle,
  useDesignStudioStore,
} from '../../../DesignStudioStore';

export interface BorderRadiusFieldProps {
  elementId: string;
}

const corners = [
  'borderRadiusTopLeft',
  'borderRadiusTopRight',
  'borderRadiusBottomRight',
  'borderRadiusBottomLeft',
] as const;

type CornerKey = (typeof corners)[number];

const cornerLabels: Record<CornerKey, string> = {
  borderRadiusTopLeft: 'designs.border.radius.top-left',
  borderRadiusTopRight: 'designs.border.radius.top-right',
  borderRadiusBottomRight: 'designs.border.radius.bottom-right',
  borderRadiusBottomLeft: 'designs.border.radius.bottom-left',
};


export const BorderRadiusField = ({ elementId }: BorderRadiusFieldProps) => {
  const values = useDesignStudioStore((state) => {
    const style = state.elements[elementId].style as ContainerElementStyle;

    return {
      borderRadiusTopLeft: style.borderRadiusTopLeft,
      borderRadiusTopRight: style.borderRadiusTopRight,
      borderRadiusBottomRight: style.borderRadiusBottomRight,
      borderRadiusBottomLeft: style.borderRadiusBottomLeft,
    };
  });

  const allEqual = useMemo(() => {
    const first = values.borderRadiusTopLeft;

    return corners.every((corner) => values[corner] === first);
  }, [values]);

  const [synced, setSynced] = useState(allEqual);

  useEffect(() => {
    if (allEqual) {
      setSynced(true);
    }
  }, [allEqual]);

  const handleChange = useCallback(
    (corner: CornerKey, value: number | null) => {
      if (value === null) {
        return;
      }

      if (synced) {
        corners.forEach((key) => {
          updateElementStyle(elementId, key, value);
        });
      } else {
        updateElementStyle(elementId, corner, value);
      }
    },
    [elementId, synced],
  );

  const handleToggleSync = useCallback(() => {
    if (synced) {
      setSynced(false);
    } else {
      const value = values.borderRadiusTopLeft;

      corners.forEach((key) => {
        updateElementStyle(elementId, key, value);
      });
      setSynced(true);
    }
  }, [elementId, synced, values.borderRadiusTopLeft]);

  return (
    <Group gap={1}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 'var(--space-1)',
          flex: 1,
          minWidth: 0,
        }}
      >
        {corners.map((corner) => (
          <NumberField
            key={corner}
            variant="subtle"
            size="md"
            value={values[corner]}
            onValueChange={(value) => handleChange(corner, value)}
            min={0}
            max={100}
            step={1}
            trailing="px"
          />
        ))}
      </div>
      <IconButton
        icon={synced ? 'link' : 'unlink'}
        label="designs.border.radius.sync"
        variant="subtle"
        size="md"
        color={synced ? 'regular' : 'muted'}
        onClick={handleToggleSync}
      />
    </Group>
  );
};
