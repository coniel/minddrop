import { describe, expect, it } from 'vitest';
import { YAML } from '@minddrop/utils';
import { parseProperties } from './parseProperties';

const properties = {
  text: 'Sample string',
  number: 42,
  checkbox: true,
  date: new Date('2024-01-01T10:00:00Z'),
};

const stringifiedProperties = YAML.stringify(properties);

describe('parseProperties', () => {
  it('parses properties from a string', () => {
    const parsed = parseProperties(stringifiedProperties);

    expect(parsed).toEqual(properties);
  });
});
