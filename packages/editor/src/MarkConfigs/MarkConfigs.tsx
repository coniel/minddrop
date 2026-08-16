import React from 'react';
import { MarkConfig } from '../types';
import './MarkConfigs.css';

export const boldMarkConfig: MarkConfig = {
  key: 'bold',
  label: 'editor.marks.bold',
  icon: 'bold',
  component: ({ children }) => <strong>{children}</strong>,
  shortcuts: [
    { trigger: { start: '**', end: '**' } },
    { trigger: { start: '__', end: '__' } },
  ],
  hotkeys: [{ keys: ['mod', 'B'] }],
};

export const italicMarkConfig: MarkConfig = {
  key: 'italic',
  label: 'editor.marks.italic',
  icon: 'italic',
  component: ({ children }) => <em>{children}</em>,
  shortcuts: [
    { trigger: { start: '_', end: '_' } },
    { trigger: { start: '*', end: '*' } },
  ],
  hotkeys: [{ keys: ['mod', 'I'] }],
};

export const strikethroughMarkConfig: MarkConfig = {
  key: 'strikethrough',
  label: 'editor.marks.strikethrough',
  icon: 'strikethrough',
  component: ({ children }) => (
    <span className="strikethrough-mark">{children}</span>
  ),
  shortcuts: [
    { trigger: { start: '~~', end: '~~' } },
    { trigger: { start: '~', end: '~' } },
  ],
  hotkeys: [{ keys: ['mod', 'Shift', 'X'] }],
};

export const codeMarkConfig: MarkConfig = {
  key: 'code',
  label: 'editor.marks.code',
  icon: 'code',
  component: ({ children }) => <code className="code-mark">{children}</code>,
  shortcuts: [
    { trigger: { start: '``', end: '``' } },
    { trigger: { start: '`', end: '`' } },
  ],
  hotkeys: [{ keys: ['mod', 'E'] }],
};

/**
 * The marks markdown provides. There are exactly four, because markdown has
 * exactly four inline formatting constructs which wrap arbitrary text.
 */
export const MarkConfigs: MarkConfig[] = [
  boldMarkConfig,
  italicMarkConfig,
  strikethroughMarkConfig,
  codeMarkConfig,
];
