import React from 'react';
import { KeyboardShortcut } from '@minddrop/ui';

export const KeyboardShortcutDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {typeof window !== 'undefined' && (
      <KeyboardShortcut keys={['Ctrl', 'N']} color="contrast" />
    )}
  </div>
);

export default KeyboardShortcutDemo;
