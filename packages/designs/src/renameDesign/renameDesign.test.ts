import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { PathConflictError } from '@minddrop/file-system';
import { InvalidParameterError, omitPath, restoreDates } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignFileExtension } from '../constants';
import { DefaultCardDesign } from '../default-designs';
import { DesignUpdatedEvent, DesignUpdatedEventData } from '../events';
import {
  MockFs,
  cleanup,
  design_card_1,
  design_list_1,
  designsRootPath,
  setup,
} from '../test-utils';
import { renameDesign } from './renameDesign';

const newName = 'New name';
const newPath = `${designsRootPath}/${newName}.${DesignFileExtension}`;
const lastModified = new Date('2000-01-01T00:00:00.000Z');

const updatedDesign = {
  ...design_card_1,
  name: newName,
  path: newPath,
  lastModified,
};

describe('renameDesign', () => {
  beforeEach(() => {
    setup();

    vi.setSystemTime(lastModified);
  });

  afterEach(cleanup);

  it('prevents renaming default designs', async () => {
    await expect(() =>
      renameDesign(DefaultCardDesign.id, 'New name'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('returns the design as is if the new name is the same', async () => {
    const result = await renameDesign(design_card_1.id, design_card_1.name);

    expect(result).toEqual(design_card_1);
  });

  it('throws if the new path is already taken', async () => {
    await expect(() =>
      renameDesign(design_card_1.id, design_list_1.name),
    ).rejects.toThrow(PathConflictError);
  });

  it('renames the design file', async () => {
    await renameDesign(design_card_1.id, newName);

    expect(MockFs.exists(design_card_1.path)).toBe(false);
    expect(MockFs.exists(newPath)).toBe(true);
  });

  it('writes the updated design to the file system', async () => {
    await renameDesign(design_card_1.id, newName);

    expect(restoreDates(MockFs.readJsonFile(newPath))).toEqual(
      omitPath(updatedDesign),
    );
  });

  it('updates the design design in the store', async () => {
    await renameDesign(design_card_1.id, newName);

    const updated = DesignsStore.get(design_card_1.id)!;

    expect(updated).toMatchObject(updatedDesign);
  });

  it('dispatches a design updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignUpdatedEventData>(
        DesignUpdatedEvent,
        'test',
        (payload) => {
          expect(payload.data.original).toEqual(design_card_1);
          expect(payload.data.updated).toMatchObject(updatedDesign);
          done();
        },
      );

      renameDesign(design_card_1.id, newName);
    }));

  it('returns the updated design', async () => {
    const result = await renameDesign(design_card_1.id, newName);

    expect(result).toMatchObject(updatedDesign);
  });
});
