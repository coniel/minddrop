import React from 'react';
import { IconButton } from './IconButton';
import { Text } from '../Text';
import { Icon } from '../Icon';

export default {
  title: 'ui/IconButton',
  component: IconButton,
};

export const Default: React.FC = () => (
  <div>
    <Text size="large" color="light" weight="semibold" component="div">
      Sizes
    </Text>
    <IconButton label="settings">
      <Icon name="settings" />
    </IconButton>
    <IconButton size="small" label="settings">
      <Icon name="settings" />
    </IconButton>

    <Text
      size="large"
      color="light"
      weight="semibold"
      component="div"
      style={{ marginTop: 20 }}
    >
      Colors
    </Text>
    <IconButton label="settings">
      <Icon name="settings" />
    </IconButton>
    <IconButton color="light" label="settings">
      <Icon name="settings" />
    </IconButton>
    <span
      style={{ backgroundColor: 'hsl(195 7.1% 11%)', display: 'inline-block' }}
    >
      <IconButton color="contrast" label="settings">
        <Icon name="settings" />
      </IconButton>
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
    <IconButton disabled label="settings">
      <Icon name="settings" />
    </IconButton>
    <IconButton disabled color="light" label="settings">
      <Icon name="settings" />
    </IconButton>
    <span
      style={{ backgroundColor: 'hsl(195 7.1% 11%)', display: 'inline-block' }}
    >
      <IconButton disabled color="contrast" label="settings">
        <Icon name="settings" />
      </IconButton>
    </span>
  </div>
);
