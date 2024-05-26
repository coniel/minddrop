import React from 'react';
import { MarkConfig } from './types';

export const boldMarkConfig: MarkConfig = {
  key: 'bold',
  component: ({ children }) => <strong>{children}</strong>,
  shortcuts: [
    { trigger: { start: '**', end: '**' } },
    { trigger: { start: '__', end: '__' } },
  ],
  hotkeys: [{ keys: ['mod', 'B'] }],
};

export const italicMarkConfig: MarkConfig = {
  key: 'italic',
  component: ({ children }) => <em>{children}</em>,
  shortcuts: [
    { trigger: { start: '_', end: '_' } },
    { trigger: { start: '*', end: '*' } },
  ],
  hotkeys: [{ keys: ['mod', 'I'] }],
};

export const underlineMarkConfig: MarkConfig = {
  key: 'underline',
  component: ({ children }) => <u>{children}</u>,
  hotkeys: [{ keys: ['mod', 'U'] }],
};

export const strikethroughMarkConfig: MarkConfig = {
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
