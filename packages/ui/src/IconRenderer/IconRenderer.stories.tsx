import React from 'react';
import { IconRenderer } from './IconRenderer';
import { Text } from '../Text';
import { Icon } from '../Icon';

export default {
  title: 'ui/IconRenderer',
  component: IconRenderer,
};

export const Default: React.FC = () => (
  <div>
    <div>
      <Text component="div" size="large" color="light" weight="medium">
        Using an icon name
      </Text>
      <div style={{ display: 'flex', columnGap: 8, padding: 8 }}>
        <IconRenderer color="regular" icon="settings" />
        <IconRenderer color="light" icon="settings" />
      </div>
    </div>
    <div style={{ marginTop: 16 }}>
      <Text component="div" size="large" color="light" weight="medium">
        Using an Icon component
      </Text>
      <div style={{ display: 'flex', columnGap: 8, padding: 8 }}>
        <IconRenderer icon={<Icon name="settings" />} />
        <IconRenderer icon={<Icon name="settings" color="light" />} />
      </div>
    </div>
  </div>
);
