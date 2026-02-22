import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { DesignsStore } from '../DesignsStore';
import { i18nRoot } from '../constants';
import { DesignCreatedEvent, DesignCreatedEventData } from '../events';
import { MockFs, cleanup, setup } from '../test-utils';
import { Design } from '../types';
import { getDesignFilePath, getDesignsDirPath } from '../utils';
import { createDesign } from './createDesign';

const newDesign: Design = {
  name: 'New card',
  type: 'card',
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

    expect(MockFs.exists(getDesignsDirPath())).toBe(true);
  });

  it('adds the design to the store', async () => {
    const result = await createDesign(newDesign.type, newDesign.name);

    expect(DesignsStore.get(result.id)).toMatchObject(newDesign);
  });

  it('writes the design to the file system', async () => {
    const result = await createDesign(newDesign.type, newDesign.name);

    expect(MockFs.exists(getDesignFilePath(result.id))).toBe(true);
  });

  it('defaults the design name to the design type name', async () => {
    const result = await createDesign(newDesign.type);

    expect(result.name).toBe(i18n.t(`${i18nRoot}.${newDesign.type}.name`));
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
