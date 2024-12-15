import React, { useState } from 'react';
import { ContentIconName } from '@minddrop/icons';
import { ContentIcon } from '../ContentIcon';
import { ContentColor } from '../types';
import { ContentIconPicker } from './ContentIconPicker';

export default {
  title: 'ui/ContentIconPicker',
  component: ContentIconPicker,
};

export const Default: React.FC = () => {
  const [icon, setIcon] = useState<ContentIconName | null>(null);
  const [color, setColor] = useState<ContentColor>('default');

  return (
    <div>
      <div style={{ height: 20 }}>
        {icon && <ContentIcon color={color} name={icon} />}
      </div>
      <ContentIconPicker
        onSelect={(iconValue, colorValue) => {
          setIcon(iconValue);
          setColor(colorValue);
        }}
      />
    </div>
  );
};
