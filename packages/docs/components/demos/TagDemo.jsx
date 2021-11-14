import React from 'react';
import { Tag } from '@minddrop/ui';

export const TagDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ display: 'flex', columnGap: 8 }}>
      <Tag color="red" label="Important" />
      <Tag color="blue" label="Equation" />
      <Tag color="gray" label="Diagram" />
    </div>
  </div>
);

export default TagDemo;
