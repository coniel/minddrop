import React from 'react';
import { RichTextMarkConfig } from './types';

export const boldMarkConfig: RichTextMarkConfig = {
  key: 'bold',
  component: ({ children }) => <strong>{children}</strong>,
  shortcuts: [
    { trigger: { start: '**', end: '**' } },
    { trigger: { start: '__', end: '__' } },
  ],
  hotkeys: [{ keys: ['mod', 'B'] }],
};

export const italicMarkConfig: RichTextMarkConfig = {
  key: 'italic',
  component: ({ children }) => <em>{children}</em>,
  shortcuts: [
    { trigger: { start: '_', end: '_' } },
    { trigger: { start: '*', end: '*' } },
  ],
  hotkeys: [{ keys: ['mod', 'I'] }],
};

export const underlineMarkConfig: RichTextMarkConfig = {
  key: 'underline',
  component: ({ children }) => <u>{children}</u>,
  hotkeys: [{ keys: ['mod', 'U'] }],
};

export const strikethroughMarkConfig: RichTextMarkConfig = {
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
