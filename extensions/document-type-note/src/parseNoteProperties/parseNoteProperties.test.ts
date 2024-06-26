import { describe, it, expect } from 'vitest';
import { parseNoteProperties } from './parseNoteProperties';
import { DefaultNoteProperties } from '../constants';

const fileTextContent = `---
  icon: 'content:cat:cyan'
  customProperty: 'foo'
---

# Document Title
`;

const fileTextContentWithoutIcon = `---
  customProperty: 'foo'
---

# Document Title
`;

describe('parseNoteProperties', () => {
  it('does something useful', () => {
    expect(parseNoteProperties(fileTextContent)).toEqual({
      icon: 'content:cat:cyan',
      customProperty: 'foo',
    });
  });

  it('adds default properties if not present', () => {
    expect(parseNoteProperties(fileTextContentWithoutIcon)).toEqual({
      ...DefaultNoteProperties,
      customProperty: 'foo',
    });
  });

  it('returns default properties if no properties are present', () => {
    expect(parseNoteProperties('')).toEqual(DefaultNoteProperties);
  });
});
