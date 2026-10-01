import { describe, expect, it } from 'vitest';
import { isPdfRenderCancellation } from './isPdfRenderCancellation';

describe('isPdfRenderCancellation', () => {
  it('recognises a cancelled render', () => {
    const error = new Error('cancelled');

    error.name = 'RenderingCancelledException';

    expect(isPdfRenderCancellation(error)).toBe(true);
  });

  it('recognises an aborted text layout', () => {
    const error = new Error('aborted');

    error.name = 'AbortException';

    expect(isPdfRenderCancellation(error)).toBe(true);
  });

  it('rejects other errors', () => {
    expect(isPdfRenderCancellation(new Error('failed'))).toBe(false);
    expect(isPdfRenderCancellation('failed')).toBe(false);
  });
});
