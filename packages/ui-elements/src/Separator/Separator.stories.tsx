import React from 'react';
import { Text } from '../Text';
import { Separator } from './Separator';

export default {
  title: 'ui/Separator',
  component: Separator,
};

export const Default: React.FC = () => (
  <div style={{ width: '100%', maxWidth: 300, margin: '0 15px' }}>
    <Text as="div" weight="medium" size="large">
      MindDrop UI
    </Text>
    <Text as="div" size="large">
      An open-source UI component library.
    </Text>
    <Separator margin="large" />
    <div style={{ display: 'flex', height: 20, alignItems: 'center' }}>
      <Text>Blog</Text>
      <Separator decorative orientation="vertical" margin="large" />
      <Text>Docs</Text>
      <Separator decorative orientation="vertical" margin="large" />
      <Text>Source</Text>
    </div>
  </div>
);
