import { describe, expect, it } from 'vitest';
import {
  DesignElementTemplatesDataKey,
  DesignLayoutTypesDataKey,
} from '../../constants';
import { resolveLayoutTypeDragData } from './resolveLayoutTypeDragData';

describe('resolveLayoutTypeDragData', () => {
  it('resolves the dragged layout type', () => {
    expect(
      resolveLayoutTypeDragData({
        [DesignLayoutTypesDataKey]: [{ layoutType: 'card' }],
      }),
    ).toEqual({ layoutType: 'card' });
  });

  it('returns null when the drop has no layout type', () => {
    expect(
      resolveLayoutTypeDragData({
        [DesignElementTemplatesDataKey]: [{ type: 'text' }],
      }),
    ).toBeNull();
  });

  it('returns null when the payload is empty', () => {
    expect(
      resolveLayoutTypeDragData({ [DesignLayoutTypesDataKey]: [] }),
    ).toBeNull();
  });
});
