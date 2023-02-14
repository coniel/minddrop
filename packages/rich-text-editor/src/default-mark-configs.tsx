import React from 'react';
import { RTMarkConfig } from './types';

export const boldMarkConfig: RTMarkConfig = {
  key: 'bold',
  component: ({ children }) => <strong>{children}</strong>,
  shortcuts: [
    { start: '**', end: '**' },
    { start: '__', end: '__' },
  ],
  hotkeys: [{ keys: ['Ctrl', 'B'] }],
};

export const italicMarkConfig: RTMarkConfig = {
  key: 'italic',
  component: ({ children }) => <em>{children}</em>,
  shortcuts: [
    { start: '_', end: '_' },
    { start: '*', end: '*' },
  ],
  hotkeys: [{ keys: ['Ctrl', 'I'] }],
};

export const underlineMarkConfig: RTMarkConfig = {
  key: 'underline',
  component: ({ children }) => <u>{children}</u>,
  hotkeys: [{ keys: ['Ctrl', 'U'] }],
};

export const strikethroughMarkConfig: RTMarkConfig = {
  key: 'strikethrough',
  component: ({ children }) => (
    <span style={{ textDecoration: 'line-through' }}>{children}</span>
  ),
  shortcuts: [{ start: '~', end: '~' }],
};

export const defaultMarkConfigs = [
  boldMarkConfig,
  italicMarkConfig,
  underlineMarkConfig,
  strikethroughMarkConfig,
];
