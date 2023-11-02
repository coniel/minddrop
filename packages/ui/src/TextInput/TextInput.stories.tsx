import React from 'react';
import { TextInput } from './TextInput';

export default {
  title: 'ui/TextInput',
  component: TextInput,
};

export const Default: React.FC = () => (
  <div
    style={{ display: 'flex', flexDirection: 'column', rowGap: 8, width: 300 }}
  >
    <TextInput />
    <TextInput placeholder="Placeholder" />
    <TextInput defaultValue="Default value" />
  </div>
);
