import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Text } from '../Text';

export default {
  title: 'ui/Sidebar',
  component: Sidebar,
};

export const Default: React.FC = () => {
  const [width, setWidth] = useState(300);

  return (
    <div
      style={{ width: '100%', height: '100%', marginTop: -16, marginLeft: -16 }}
    >
      <Sidebar
        initialWidth={width}
        onResized={setWidth}
        style={{ padding: '24px 16px' }}
      >
        <Text component="div" size="large" color="light">
          Drag border to resize
        </Text>
        <Text component="div">Saved width: {width}px</Text>
      </Sidebar>
    </div>
  );
};
