import { describe, expect, it } from 'vitest';
import {
  headingElement1,
  paragraphElement1,
  paragraphElement2,
} from '../../test-utils';
import { IdentifiedElement } from '../../types';
import { hasBlockId } from '../../utils';
import { assignBlockIds } from './assignBlockIds';

// A paragraph which already carries a block ID
const paragraphWithId: IdentifiedElement = {
  ...paragraphElement1,
  id: 'existing-id',
};

describe('assignBlockIds', () => {
  it('assigns an ID to elements which do not have one', () => {
    const elements = assignBlockIds([paragraphElement1, headingElement1]);

    elements.forEach((element) => {
      expect(hasBlockId(element)).toBe(true);
    });
  });

  it('assigns a unique ID to each element', () => {
    const elements = assignBlockIds([paragraphElement1, paragraphElement2]);
    const ids = elements.map((element) =>
      hasBlockId(element) ? element.id : null,
    );

    expect(new Set(ids).size).toBe(2);
  });

  it('preserves existing IDs', () => {
    const elements = assignBlockIds([paragraphWithId, paragraphElement2]);

    expect(elements[0]).toHaveProperty('id', 'existing-id');
  });

  it('preserves the element data', () => {
    const elements = assignBlockIds([headingElement1]);

    expect(elements[0]).toMatchObject(headingElement1);
  });
});
