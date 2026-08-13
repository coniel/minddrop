import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { writeDesign } from './writeDesign';

const { design_books, design_space_virtual } = DesignFixtures;

describe('writeDesign', () => {
  beforeEach(() => setup({ loadDesignFiles: false }));
  afterEach(cleanup);

  it('writes the design to its bundle directory', async () => {
    await writeDesign(design_books.id);

    expect(MockFs.readTextFile(resolveDesignFilePath(design_books.id))).toEqual(
      JSON.stringify(design_books),
    );
  });

  it('throws when the design is virtual', async () => {
    // Load the virtual design into the store
    DesignsStore.set(design_space_virtual);

    await expect(writeDesign(design_space_virtual.id)).rejects.toThrow(
      InvalidParameterError,
    );
  });
});
