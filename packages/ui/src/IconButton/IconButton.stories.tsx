import React from 'react';
import { IconButton } from './IconButton';
import { Text } from '../Text';

export default {
  title: 'ui/IconButton',
  component: IconButton,
};

export const Default: React.FC = () => (
  <div>
    <Text size="large" color="light" weight="semibold" component="div">
      Sizes
    </Text>
    <IconButton icon="settings" label="settings" />
    <IconButton icon="settings" size="small" label="settings" />

    <Text
      size="large"
      color="light"
      weight="semibold"
      component="div"
      style={{ marginTop: 20 }}
    >
      Colors
    </Text>
    <IconButton icon="settings" label="settings" />
    <IconButton icon="settings" color="light" label="settings" />
    <span
      style={{ backgroundColor: 'hsl(195 7.1% 11%)', display: 'inline-block' }}
    >
      <IconButton icon="settings" color="contrast" label="settings" />
    </span>

    <Text
      size="large"
      color="light"
      weight="semibold"
      component="div"
      style={{ marginTop: 20 }}
    >
      Disabled
    </Text>
    <IconButton icon="settings" disabled label="settings" />
    <IconButton icon="settings" disabled color="light" label="settings" />
    <span
      style={{ backgroundColor: 'hsl(195 7.1% 11%)', display: 'inline-block' }}
    >
      <IconButton icon="settings" disabled color="contrast" label="settings" />
    </span>
  </div>
);
