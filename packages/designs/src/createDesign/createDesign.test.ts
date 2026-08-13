import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent, DesignCreatedEventData } from '../events';
import { MockFs, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath, resolveDesignsDirPath } from '../utils';
import { createDesign } from './createDesign';

describe('createDesign', () => {
  beforeEach(() => setup({ loadDesignFiles: false }));
  afterEach(cleanup);

  it('ensures that the designs root directory exists', async () => {
    MockFs.clear();

    await createDesign({ type: 'database', name: 'Books' });

    expect(MockFs.exists(resolveDesignsDirPath())).toBe(true);
  });

  it('adds the design to the store', async () => {
    const result = await createDesign({ type: 'database', name: 'Books' });

    expect(DesignsStore.get(result.id)).toEqual(result);
  });

  it('writes the design to the file system', async () => {
    const result = await createDesign({ type: 'database', name: 'Books' });

    expect(MockFs.exists(resolveDesignFilePath(result.id))).toBe(true);
  });

  it('seeds database designs with the entry metadata properties', async () => {
    const result = await createDesign({ type: 'database' });

    expect(result.type).toBe('database');

    if (result.type === 'database') {
      expect(result.properties).toEqual([
        expect.objectContaining({ type: 'title', name: 'Title' }),
        expect.objectContaining({ type: 'created', name: 'Created' }),
        expect.objectContaining({
          type: 'last-modified',
          name: 'Last modified',
        }),
      ]);
    }
  });

  it('creates non-database designs without properties', async () => {
    const result = await createDesign({ type: 'space' });

    expect(result.type).toBe('space');
    expect('properties' in result).toBe(false);
  });

  it('defaults the design name to the localized new design label', async () => {
    const result = await createDesign({ type: 'database' });

    expect(result.name).toBe(i18n.t('designs.new'));
  });

  it('dispatches a design created event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignCreatedEventData>(
        DesignCreatedEvent,
        'test',
        (payload) => {
          expect(payload.data.name).toBe('Books');
          done();
        },
      );

      createDesign({ type: 'database', name: 'Books' });
    }));
});
