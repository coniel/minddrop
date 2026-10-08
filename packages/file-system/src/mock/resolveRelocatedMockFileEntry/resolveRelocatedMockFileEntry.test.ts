import { describe, expect, it } from 'vitest';
import { documentA1, documents, workspaceA } from '../../test-utils';
import { resolveRelocatedMockFileEntry } from './resolveRelocatedMockFileEntry';

const NewPath = `${documents.path}/Renamed`;

describe('resolveRelocatedMockFileEntry', () => {
  it('moves the entry to the path, named after it', () => {
    const entry = resolveRelocatedMockFileEntry(workspaceA, NewPath);

    expect(entry.path).toBe(NewPath);
    expect(entry.name).toBe('Renamed');
  });

  it('moves the descendants below the new path', () => {
    const entry = resolveRelocatedMockFileEntry(workspaceA, NewPath);

    expect(entry.children).toContainEqual({
      ...documentA1,
      path: `${NewPath}/${documentA1.name}`,
    });
  });

  it('leaves the original entry in place', () => {
    resolveRelocatedMockFileEntry(workspaceA, NewPath);

    expect(workspaceA.children).toContain(documentA1);
    expect(documentA1.path).toBe(`${workspaceA.path}/${documentA1.name}`);
  });
});
