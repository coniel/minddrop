import { useCallback } from 'react';
import { ContainerDirection } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import './DirectionToggle.css';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface DirectionToggleProps {
  elementId: string;
}

const directions: {
  label: string;
  value: ContainerDirection;
  icon: 'arrow-down' | 'arrow-right';
}[] = [
  {
    label: 'designs.direction.column',
    value: 'column',
    icon: 'arrow-down',
  },
  {
    label: 'designs.direction.row',
    value: 'row',
    icon: 'arrow-right',
  },
];

export const DirectionToggle = ({ elementId }: DirectionToggleProps) => {
  const { t } = useTranslation();
  const direction = useElementStyle(elementId, 'direction');

  const handleSelect = useCallback(
    (value: ContainerDirection) => {
      updateElementStyle(elementId, 'direction', value);
    },
    [elementId],
  );

  return (
    <RadioToggleGroup
        size="md"
        value={direction}
        onValueChange={handleSelect}
        className="direction-toggle"
      >
        {directions.map((dir) => (
          <Toggle key={dir.value} {...dir} label={t(dir.label)} />
        ))}
    </RadioToggleGroup>
  );
};
