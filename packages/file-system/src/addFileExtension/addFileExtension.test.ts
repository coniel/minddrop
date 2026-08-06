import { describe, expect, it } from 'vitest';
import { addFileExtension } from './addFileExtension';

describe('addFileExtension', () => {
  it('appends the extension to the path', () => {
    expect(addFileExtension('path', 'extension')).toEqual('path.extension');
  });
});
