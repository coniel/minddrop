import React, { useState } from 'react';
import { IconPicker } from './IconPicker';
import { ContentIcon } from '../ContentIcon';
import { ContentIconName } from '@minddrop/icons';
import { ContentColor } from '../types';

export default {
  title: 'ui/IconPicker',
  component: IconPicker,
};

export const Default: React.FC = () => {
  const [icon, setIcon] = useState<ContentIconName | null>(null);
  const [color, setColor] = useState<ContentColor>('default');

  return (
    <div>
      <div style={{ height: 20 }}>
        {icon && <ContentIcon color={color} name={icon} />}
      </div>
      <IconPicker
        onSelect={(iconValue, colorValue) => {
          setIcon(iconValue);
          setColor(colorValue);
        }}
        onClear={() => {
          setIcon(null);
          setColor('default');
        }}
      />
    </div>
  );
};
