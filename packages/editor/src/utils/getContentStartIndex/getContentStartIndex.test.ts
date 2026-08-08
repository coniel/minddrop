import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  setup,
  titleElement1,
} from '../../test-utils';
import { getContentStartIndex } from './getContentStartIndex';

describe('getContentStartIndex', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('is the first node in editors without a title', () => {
    const editor = createTestEditor([paragraphElement1]);

    expect(getContentStartIndex(editor)).toBe(0);
  });

  it('is the node below the title in editors with one', () => {
    const editor = createTestEditor([titleElement1, paragraphElement1]);

    expect(getContentStartIndex(editor)).toBe(1);
  });
});
