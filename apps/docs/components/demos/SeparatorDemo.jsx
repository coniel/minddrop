import React from 'react';
import { violet } from '@radix-ui/colors';
import { Separator, Text } from '@minddrop/ui';

export const SeparatorDemo = () => (
  <div style={{ width: '100%', maxWidth: 300, margin: '0 15px' }}>
    <Text component="div" weight="medium" size="large" color="white">
      MindDrop UI
    </Text>
    <Text component="div" size="large" color="white">
      An open-source UI component library.
    </Text>
    <Separator margin="large" style={{ backgroundColor: violet.violet6 }} />
    <div style={{ display: 'flex', height: 20, alignItems: 'center' }}>
      <Text color="white">Blog</Text>
      <Separator
        decorative
        orientation="vertical"
        margin="large"
        style={{ backgroundColor: violet.violet6 }}
      />
      <Text color="white">Docs</Text>
      <Separator
        decorative
        orientation="vertical"
        margin="large"
        style={{ backgroundColor: violet.violet6 }}
      />
      <Text color="white">Source</Text>
    </div>
  </div>
);

export default SeparatorDemo;
