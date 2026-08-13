import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignDeletedEvent, DesignDeletedEventData } from '../events';
import { MockFs, cleanup, design_books, setup } from '../test-utils';
import {
  resolveDesignBundleDirPath,
  resolveDesignMediaDirPath,
} from '../utils';
import { deleteDesign } from './deleteDesign';

describe('deleteDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the design bundle directory', async () => {
    await deleteDesign(design_books.id);

    expect(MockFs.exists(resolveDesignBundleDirPath(design_books.id))).toBe(
      false,
    );
  });

  it('deletes the design media along with the bundle', async () => {
    const mediaPath = `${resolveDesignMediaDirPath(design_books.id)}/image.png`;

    MockFs.addFiles([{ path: mediaPath, textContent: 'image data' }]);

    await deleteDesign(design_books.id);

    expect(MockFs.exists(mediaPath)).toBe(false);
  });

  it('removes the design from the store', async () => {
    await deleteDesign(design_books.id);

    expect(DesignsStore.get(design_books.id)).toBeNull();
  });

  it('dispatches a design deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignDeletedEventData>(
        DesignDeletedEvent,
        'test',
        (payload) => {
          expect(payload.data).toEqual(design_books);
          done();
        },
      );

      deleteDesign(design_books.id);
    }));
});
