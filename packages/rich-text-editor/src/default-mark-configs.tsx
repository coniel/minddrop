import React from 'react';
import { RTMarkConfig } from './types';

export const boldMarkConfig: RTMarkConfig = {
  key: 'bold',
  component: ({ children }) => <strong>{children}</strong>,
  shortcuts: [
    { trigger: { start: '**', end: '**' } },
    { trigger: { start: '__', end: '__' } },
  ],
  hotkeys: [{ keys: ['mod', 'B'] }],
};

export const italicMarkConfig: RTMarkConfig = {
  key: 'italic',
  component: ({ children }) => <em>{children}</em>,
  shortcuts: [
    { trigger: { start: '_', end: '_' } },
    { trigger: { start: '*', end: '*' } },
  ],
  hotkeys: [{ keys: ['mod', 'I'] }],
};

export const underlineMarkConfig: RTMarkConfig = {
  key: 'underline',
  component: ({ children }) => <u>{children}</u>,
  hotkeys: [{ keys: ['mod', 'U'] }],
};

export const strikethroughMarkConfig: RTMarkConfig = {
  key: 'strikethrough',
  component: ({ children }) => (
    <span style={{ textDecoration: 'line-through' }}>{children}</span>
  ),
  shortcuts: [{ trigger: { start: '~', end: '~' } }],
};

export const defaultMarkConfigs = [
  boldMarkConfig,
  italicMarkConfig,
  underlineMarkConfig,
  strikethroughMarkConfig,
];
