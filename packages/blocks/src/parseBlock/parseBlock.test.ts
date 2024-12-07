import { describe, it, expect } from 'vitest';
import { parseBlock } from './parseBlock';
import { BlockParseError } from '../errors';
import { block1 } from '../test-utils';

describe('parseBlock', () => {
  it('throws if the serialized block is invalid', () => {
    expect(() => parseBlock('invalid')).toThrow(BlockParseError);
  });

  it('parses string serialized block', () => {
    const block = parseBlock(JSON.stringify(block1));

    expect(block).toEqual(block1);
  });

  it('parses deserialized block', () => {
    const block = parseBlock(JSON.parse(JSON.stringify(block1)));

    expect(block).toEqual(block1);
  });

  it('restores dates', () => {
    const block = parseBlock({
      ...JSON.parse(JSON.stringify(block1)),
      date: new Date().toISOString(),
    });

    expect(block.date).toBeInstanceOf(Date);
  });
});
