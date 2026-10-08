import { describe, expect, it } from 'vitest';
import {
  documentA1,
  documentA2,
  documentA3,
  documentB1,
  documentB2,
  documentB3,
  documents,
  workspaceA,
} from '../../test-utils';
import { resolveFsEntryFilePaths } from './resolveFsEntryFilePaths';

describe('resolveFsEntryFilePaths', () => {
  it('returns the paths of the files at every depth', () => {
    expect(resolveFsEntryFilePaths([documents])).toEqual([
      documentA1.path,
      documentA2.path,
      documentA3.path,
      documentB1.path,
      documentB2.path,
      documentB3.path,
    ]);
  });

  it('leaves out directories', () => {
    expect(resolveFsEntryFilePaths([documents])).not.toContain(workspaceA.path);
  });

  it('leaves out empty directories', () => {
    expect(
      resolveFsEntryFilePaths([{ path: 'empty', name: 'empty', children: [] }]),
    ).toEqual([]);
  });
});
