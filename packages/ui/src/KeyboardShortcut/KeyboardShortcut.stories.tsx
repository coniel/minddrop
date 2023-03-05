import React from 'react';
import { KeyboardShortcut } from './KeyboardShortcut';

export default {
  title: 'ui/KeyboardShortcut',
  component: KeyboardShortcut,
};

export const Default: React.FC = () => (
  <div>
    <KeyboardShortcut keys={['Ctrl', 'N']} />
  </div>
);
