import { describe, expect, it } from 'vitest';
import { TextElementConfig } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { DropEventData } from '@minddrop/selection';
import {
  DesignElementTemplatesDataKey,
  DesignElementsDataKey,
} from '../../constants';
import { isValidDesignStudioDrop } from './isValidDesignStudioDrop';

const { element_text_1 } = DesignFixtures;

/**
 * Builds a drop event carrying the given drag data.
 */
function createDrop(data: unknown): DropEventData {
  return {
    data,
    index: 0,
    position: 'after',
    targetId: 'root',
    targetType: 'design-element',
    event: new Event('drop'),
  } as unknown as DropEventData;
}

describe('isValidDesignStudioDrop', () => {
  it('returns true for drops carrying design element templates', () => {
    const drop = createDrop({
      [DesignElementTemplatesDataKey]: [TextElementConfig.template],
    });

    expect(isValidDesignStudioDrop(drop)).toBe(true);
  });

  it('returns true for drops carrying design elements', () => {
    const drop = createDrop({ [DesignElementsDataKey]: [element_text_1] });

    expect(isValidDesignStudioDrop(drop)).toBe(true);
  });

  it('returns true for drops carrying both data keys', () => {
    const drop = createDrop({
      [DesignElementTemplatesDataKey]: [TextElementConfig.template],
      [DesignElementsDataKey]: [element_text_1],
    });

    expect(isValidDesignStudioDrop(drop)).toBe(true);
  });

  it('returns true for empty design studio data arrays', () => {
    // The keys are present, so the drop originated in the studio
    const drop = createDrop({ [DesignElementsDataKey]: [] });

    expect(isValidDesignStudioDrop(drop)).toBe(true);
  });

  it('returns false for drops carrying unrelated data', () => {
    const drop = createDrop({ 'some-other-data': ['value'] });

    expect(isValidDesignStudioDrop(drop)).toBe(false);
  });

  it('returns false for drops with no data', () => {
    expect(isValidDesignStudioDrop(createDrop(undefined))).toBe(false);
  });

  it('returns false for drops with null data', () => {
    expect(isValidDesignStudioDrop(createDrop(null))).toBe(false);
  });

  it('returns false for drops with non-object data', () => {
    expect(isValidDesignStudioDrop(createDrop('data'))).toBe(false);
  });
});
