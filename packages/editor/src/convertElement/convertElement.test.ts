import { afterEach, describe, expect, it } from 'vitest';
import { HeadingElement } from '@minddrop/ast';
import { cleanup } from '@minddrop/test-utils';
import { headingElement1, paragraphElement1 } from '../test-utils';
import { convertElement } from './convertElement';

describe('convertElement', () => {
  afterEach(cleanup);

  describe('with `convert` callback', () => {
    it("uses the new element type's `convert` callback to convert it", () => {
      // Convert a paragraph into a heading, whose convert callback reads
      // the level from the shortcut which triggered it
      const converted = convertElement(
        paragraphElement1,
        'heading',
        '### ',
      ) as HeadingElement;

      expect(converted.type).toBe('heading');
      expect(converted.level).toBe(3);
    });
  });

  describe('without `convert` callback', () => {
    it('changes the element type to the new type', () => {
      // Convert a heading into a paragraph
      const converted = convertElement(headingElement1, 'paragraph');

      // Should change type to 'paragraph'
      expect(converted.type).toBe('paragraph');
    });
  });

  it('does nothing if the new type has no editor config', () => {
    const converted = convertElement(paragraphElement1, 'foo');

    // Should maintain paragraph type
    expect(converted).toEqual(paragraphElement1);
  });
});
