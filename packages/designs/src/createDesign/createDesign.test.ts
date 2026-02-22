import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { DesignsStore } from '../DesignsStore';
import { DesignFileExtension, i18nRoot } from '../constants';
import { DesignCreatedEvent, DesignCreatedEventData } from '../events';
import { MockFs, cleanup, designsRootPath, setup } from '../test-utils';
import { Design } from '../types';
import { createDesign } from './createDesign';

const newDesign: Design = {
  name: 'New card',
  type: 'card',
  path: `${designsRootPath}/New card.${DesignFileExtension}`,
  created: expect.any(Date),
  lastModified: expect.any(Date),
  tree: {
    id: 'root',
    type: 'root',
    children: [],
  },
  id: expect.any(String),
};

describe('createDesign', () => {
  beforeEach(() => setup({ loadDesignFiles: false }));

  afterEach(cleanup);

  it('ensures that the designs root directory exists', async () => {
    // Clear the file system to delete the designs root directory
    MockFs.clear();

    await createDesign(newDesign.type, newDesign.name);

    expect(MockFs.exists(designsRootPath)).toBe(true);
  });

  it('adds the design to the store', async () => {
    const result = await createDesign(newDesign.type, newDesign.name);

    expect(DesignsStore.get(result.id)).toMatchObject(newDesign);
  });

  it('writes the design to the file system', async () => {
    const result = await createDesign(newDesign.type, newDesign.name);

    expect(MockFs.exists(result.path)).toBe(true);
  });

  it('defaults the design name to the design type name', async () => {
    const result = await createDesign(newDesign.type);

    expect(result.name).toBe(i18n.t(`${i18nRoot}.${newDesign.type}.name`));
  });

  it('increments the design name/path if a design with the same name already exists', async () => {
    await createDesign(newDesign.type);
    const result = await createDesign(newDesign.type);

    expect(result.name.includes('1')).toBe(true);
    expect(result.path.includes('1')).toBe(true);
  });

  it('dispatches a design created event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignCreatedEventData>(
        DesignCreatedEvent,
        'test',
        (payload) => {
          expect(payload.data).toMatchObject(newDesign);
          done();
        },
      );

      createDesign(newDesign.type, newDesign.name);
    }));
});
