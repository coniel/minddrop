import { afterEach, describe, expect, it, vi } from 'vitest';
import { Element, ListItemFrame } from '../../types';
import { parseListItemFromMarkdown } from './parseListItemFromMarkdown';

const consume = vi.fn();
const getNextLine = vi.fn();

function parse(line: string): Element | null {
  const result = parseListItemFromMarkdown(line, consume, getNextLine);

  return Array.isArray(result) ? result[0] : result;
}

function frameOf(element: Element | null): ListItemFrame {
  return element!.ancestry![0] as ListItemFrame;
}

describe('parseListItemFromMarkdown', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('returns null for a line which is not a list item', () => {
    expect(parse('Hello world')).toBeNull();
  });

  it('consumes the line', () => {
    parse('- One');

    expect(consume).toHaveBeenCalledOnce();
  });

  it('parses the item as a paragraph inside a list item frame', () => {
    const element = parse('- One');

    expect(element!.type).toBe('paragraph');
    expect(element!.children).toEqual([{ text: 'One' }]);
    expect(frameOf(element).kind).toBe('list-item');
  });

  it('preserves the bullet character', () => {
    ['-', '*', '+'].forEach((marker) => {
      const element = parse(`${marker} One`);

      expect(frameOf(element).marker).toBe(marker);
      expect(frameOf(element).ordered).toBe(false);
    });
  });

  it('parses ordered items', () => {
    const element = parse('3. One');
    const frame = frameOf(element);

    expect(frame.ordered).toBe(true);
    expect(frame.marker).toBe('.');
    expect(frame.number).toBe(3);
  });

  it('preserves the ordered delimiter', () => {
    expect(frameOf(parse('1) One')).marker).toBe(')');
  });

  it('preserves the indent', () => {
    expect(frameOf(parse('  - One')).indent).toBe('  ');
  });

  it('parses an unchecked task item', () => {
    const element = parse('- [ ] One');

    expect(frameOf(element).checked).toBe(false);
    expect(element!.children).toEqual([{ text: 'One' }]);
  });

  it('parses a checked task item', () => {
    expect(frameOf(parse('- [x] One')).checked).toBe(true);
    expect(frameOf(parse('- [X] One')).checked).toBe(true);
  });

  it('leaves a plain item without a checked state', () => {
    expect(frameOf(parse('- One')).checked).toBeUndefined();
  });

  it('parses the item content as inline markdown', () => {
    const element = parse('- **One**');

    expect(element!.children).toEqual([
      { text: 'One', bold: true, boldSyntax: '**' },
    ]);
  });
});
