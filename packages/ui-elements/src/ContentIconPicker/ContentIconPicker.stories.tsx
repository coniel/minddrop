import React, { useState } from 'react';
import { ContentIconPicker } from './ContentIconPicker';
import { ContentIcon } from '../ContentIcon';
import { ContentIconName } from '@minddrop/icons';
import { ContentColor } from '../types';

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
