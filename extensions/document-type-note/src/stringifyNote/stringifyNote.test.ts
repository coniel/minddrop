import { describe, it, expect, beforeAll } from 'vitest';
import yaml from 'yaml';
import { DocumentProperties } from '@minddrop/documents';
import { stringifyNote } from './stringifyNote';
import { Ast } from '@minddrop/ast';
import { DefaultNoteProperties } from '../constants';

const contentMarkdown = `# Title\n\nContent`;

const properties: DocumentProperties = {
  icon: 'content:cat:cyan',
};

const content = Ast.fromMarkdown(`# Title\n\nContent`);

const stringifiedNote = `---\n${yaml.stringify(
  properties,
)}---\n\n${contentMarkdown}`;

describe('stringifyNote', () => {
  beforeAll(() => {
    Ast.registerDefaultConfigs();
  });

  it('stringifies the note', () => {
    expect(stringifyNote(properties, content)).toBe(stringifiedNote);
  });

  it('does not include front matter if properties are all defaults', () => {
    expect(stringifyNote(DefaultNoteProperties, content)).toBe(contentMarkdown);
  });
});
