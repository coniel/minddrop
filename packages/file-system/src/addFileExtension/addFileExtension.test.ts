import { describe, expect, it } from 'vitest';
import { addFileExtension } from './addFileExtension';

describe('addFileExtension', () => {
  it('does something useful', () => {
    expect(addFileExtension('path', 'extension')).toEqual('path.extension');
  });
});
