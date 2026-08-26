import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent } from '../events';
import { MockFs, cleanup, setup } from '../test-utils';
import { Design, DesignId } from '../types';
import { resolveDesignFilePath, resolveDesignsDirPath } from '../utils';
import { createDesign } from './createDesign';

const newDesign: Design = {
  id: expect.any(String) as unknown as DesignId,
  name: 'Books',
  properties: expect.any(Array) as unknown as Design['properties'],
  layouts: [],
  created: expect.any(Date) as unknown as Date,
  lastModified: expect.any(Date) as unknown as Date,
};

describe('createDesign', () => {
  beforeEach(() => setup({ loadDesignFiles: false }));

  afterEach(cleanup);

  it('ensures that the designs root directory exists', async () => {
    MockFs.clear();

    await createDesign('Books');

    expect(MockFs.exists(resolveDesignsDirPath())).toBe(true);
  });

  it('adds the design to the store', async () => {
    const result = await createDesign('Books');

    expect(DesignsStore.get(result.id)).toMatchObject(newDesign);
  });

  it('writes the design to the file system', async () => {
    const result = await createDesign('Books');

    expect(MockFs.exists(resolveDesignFilePath(result.id))).toBe(true);
  });

  it('adds the entry metadata properties', async () => {
    const result = await createDesign('Books');

    expect(result.properties).toEqual([
      expect.objectContaining({ type: 'title', name: 'Title' }),
      expect.objectContaining({ type: 'created', name: 'Created' }),
      expect.objectContaining({
        type: 'last-modified',
        name: 'Last modified',
      }),
    ]);
  });

  it('defaults the design name to the localized new design label', async () => {
    const result = await createDesign();

    expect(result.name).toBe(i18n.t('designs.new'));
  });

  it('dispatches a design created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DesignCreatedEvent, 'test', (payload) => {
        expect(payload.data).toMatchObject(newDesign);
        done();
      });

      createDesign('Books');
    }));
});
