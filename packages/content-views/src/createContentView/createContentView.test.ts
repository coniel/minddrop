import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Icons } from '@minddrop/ui-icons';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewCreatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  contentViewType_gallery,
  mockDate,
  setup,
} from '../test-utils';
import { ContentView } from '../types';
import { resolveContentViewFilePath } from '../utils';
import { createContentView } from './createContentView';

const newView: ContentView = {
  id: expect.any(String),
  name: contentViewType_gallery.name,
  type: contentViewType_gallery.type,
  icon: Icons.fromName(contentViewType_gallery.icon),
  created: mockDate,
  lastModified: mockDate,
  dataSource: {
    type: 'database',
    id: 'database-1',
  },
  options: {
    ...contentViewType_gallery.defaultOptions,
  },
  references: [],
};

// The view as written to disk, without the references index
const { references: _references, ...writtenView } = newView;

describe('createContentView', () => {
  beforeEach(() => setup({ loadViews: false, loadViewFiles: false }));

  afterEach(cleanup);

  it('returns the new view', async () => {
    const result = await createContentView(
      contentViewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(result).toEqual(newView);
  });

  it('adds the view to the store', async () => {
    const result = await createContentView(
      contentViewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(ContentViewsStore).toHaveItem(result.id, newView);
  });

  it('writes the view to the file system', async () => {
    const view = await createContentView(
      contentViewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(
      MockFs.readJsonFile(resolveContentViewFilePath(view.id)),
    ).toMatchObject(writtenView);
  });

  it('dispatches a view created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ContentViewCreatedEvent, 'test', (payload) => {
        expect(payload).toEqual(newView);
        done();
      });

      createContentView(
        contentViewType_gallery.type,
        newView.dataSource,
        newView.name,
      );
    }));
});
