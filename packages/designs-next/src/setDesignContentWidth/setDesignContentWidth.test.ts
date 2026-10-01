import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { storeItem } from '@minddrop/stores/test-utils';
import { DesignsStore } from '../DesignsStore';
import { ContentWidthColumns, DesignTypeColumns } from '../constants';
import { DesignNotFoundError } from '../errors';
import { DesignUpdatedEvent } from '../events';
import {
  DesignElementFixtures,
  DesignFixtures,
  MockFs,
  cleanup,
  setup,
} from '../test-utils';
import { updateDesign } from '../updateDesign';
import { resolveDesignFilePath } from '../utils';
import { setDesignContentWidth } from './setDesignContentWidth';

const { pageDesign_1 } = DesignFixtures;
const {
  captionSlotElement,
  coverDesignElement,
  iconDesignElement,
  slottedDesignElement,
} = DesignElementFixtures;

describe('setDesignContentWidth', () => {
  beforeEach(async () => {
    setup();

    // Give the page a fluid cover and a fixed icon layered over it
    await updateDesign(pageDesign_1.id, {
      elements: [coverDesignElement, iconDesignElement],
    });
  });

  afterEach(cleanup);

  it('sets the content width and its columns', async () => {
    await setDesignContentWidth(pageDesign_1.id, 'narrow');

    const design = storeItem(DesignsStore, pageDesign_1.id);

    expect(design.contentWidth).toBe('narrow');
    expect(design.columns).toBe(ContentWidthColumns.narrow);
  });

  it('remaps fluid and fixed elements to the new columns', async () => {
    await setDesignContentWidth(pageDesign_1.id, 'narrow');

    const [cover, icon] = storeItem(DesignsStore, pageDesign_1.id).elements;

    // The fluid cover spans the new width, the fixed icon keeps its
    // width and the gap to its right.
    expect(cover.column).toBe(0);
    expect(cover.columnSpan).toBe(ContentWidthColumns.narrow);
    expect(icon.column).toBe(112);
    expect(icon.columnSpan).toBe(iconDesignElement.columnSpan);
  });

  it('returns the design to the type columns for full width', async () => {
    await setDesignContentWidth(pageDesign_1.id, 'narrow');
    await setDesignContentWidth(pageDesign_1.id, null);

    const design = storeItem(DesignsStore, pageDesign_1.id);

    expect(design.columns).toBe(DesignTypeColumns.page);
    expect(design).not.toHaveProperty('contentWidth');
    expect(design.elements[0].columnSpan).toBe(DesignTypeColumns.page);
  });

  it('leaves held elements as they are', async () => {
    await updateDesign(pageDesign_1.id, {
      elements: [slottedDesignElement, captionSlotElement],
    });

    await setDesignContentWidth(pageDesign_1.id, 'narrow');

    const [slotted, caption] = storeItem(
      DesignsStore,
      pageDesign_1.id,
    ).elements;

    expect(slotted.columnSpan).toBe(116);
    expect(caption).toEqual(captionSlotElement);
  });

  it('returns the updated design', async () => {
    const updated = await setDesignContentWidth(pageDesign_1.id, 'wide');

    expect(updated.contentWidth).toBe('wide');
    expect(updated.columns).toBe(ContentWidthColumns.wide);
  });

  it('writes the design to the file system', async () => {
    await setDesignContentWidth(pageDesign_1.id, 'narrow');

    expect(
      MockFs.readJsonFile(resolveDesignFilePath(pageDesign_1.id)),
    ).toMatchObject({ columns: ContentWidthColumns.narrow });
  });

  it('throws if the design does not exist', async () => {
    await expect(() =>
      setDesignContentWidth('design_missing', 'narrow'),
    ).rejects.toThrow(DesignNotFoundError);
  });

  it('dispatches the design updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignUpdatedEvent,
        'test-design-content-width-updated',
        (payload) => {
          expect(payload.updated.contentWidth).toBe('narrow');
          done();
        },
      );

      setDesignContentWidth(pageDesign_1.id, 'narrow');
    }));
});
