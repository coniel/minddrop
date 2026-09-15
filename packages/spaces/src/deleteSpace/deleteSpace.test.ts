import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { Designs } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { SpacesStore } from '../SpacesStore';
import { SpaceDeletedEvent } from '../events';
import { MockFs, cleanup, setup, space_1 } from '../test-utils';
import { resolveSpaceBundleDirPath, resolveSpaceMediaDirPath } from '../utils';
import { deleteSpace } from './deleteSpace';

const { element_content_view_1 } = DesignFixtures;
const { contentView_gallery_1 } = ContentViewFixtures;

/**
 * Loads a content view and embeds it in the space's layout through a
 * content view element, as a space with an embedded view would be.
 */
function embedContentViewInSpace(): void {
  // The content view is an ordinary persisted view, not owned by the
  // space.
  ContentViews.Store.load([contentView_gallery_1]);
  MockFs.addFiles([ContentViews.resolveFilePath(contentView_gallery_1.id)]);

  const layout = space_1.design.layouts[0];

  SpacesStore.set({
    ...space_1,
    design: {
      ...space_1.design,
      layouts: [
        {
          ...layout,
          tree: {
            ...layout.tree,
            children: [
              { ...element_content_view_1, content: contentView_gallery_1.id },
            ],
          },
        },
      ],
    },
  });
}

describe('deleteSpace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the space from the store', async () => {
    await deleteSpace(space_1.id);

    expect(SpacesStore).not.toHaveItem(space_1.id);
  });

  it('removes the space owned design from the designs store', async () => {
    await deleteSpace(space_1.id);

    expect(Designs.Store).not.toHaveItem(space_1.design.id);
  });

  it('leaves the content views embedded in the space layouts in place', async () => {
    embedContentViewInSpace();

    await deleteSpace(space_1.id);

    // Embedded content views are first-class persisted views, so they
    // outlive the space until the user is asked what to do with them.
    expect(ContentViews.Store).toHaveItem(contentView_gallery_1.id);
    expect(
      MockFs.exists(ContentViews.resolveFilePath(contentView_gallery_1.id)),
    ).toBe(true);
  });

  it('deletes the space bundle directory from the file system', async () => {
    await deleteSpace(space_1.id);

    expect(MockFs.exists(resolveSpaceBundleDirPath(space_1.id))).toBe(false);
  });

  it('deletes the space media along with the bundle', async () => {
    const mediaPath = `${resolveSpaceMediaDirPath(space_1.id)}/image.png`;

    MockFs.addFiles([{ path: mediaPath, textContent: 'image data' }]);

    await deleteSpace(space_1.id);

    expect(MockFs.exists(mediaPath)).toBe(false);
  });

  it('dispatches the space deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(SpaceDeletedEvent, 'test-space-deleted', (payload) => {
        expect(payload).toEqual(space_1);
        done();
      });

      deleteSpace(space_1.id);
    }));
});
