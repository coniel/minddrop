import React from 'react';
import { Tag } from './Tag';

export default {
  title: 'ui/Tag',
  component: Tag,
};

export const Default: React.FC = () => (
  <div style={{ display: 'flex', columnGap: 8 }}>
    <Tag color="blue" label="Blue" />
    <Tag color="cyan" label="Cyan" />
    <Tag color="red" label="Red" />
    <Tag color="pink" label="Pink" />
    <Tag color="purple" label="Purple" />
    <Tag color="green" label="Green" />
    <Tag color="yellow" label="Yellow" />
    <Tag color="orange" label="Orange" />
    <Tag color="brown" label="Brown" />
    <Tag color="gray" label="Gray" />
  </div>
);
