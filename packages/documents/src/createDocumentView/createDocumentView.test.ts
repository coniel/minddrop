import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';
import { DocumentsStore } from '../DocumentsStore';
import {
  DocumentViewNotFoundError,
  DocumentViewTypeConfigNotRegisteredError,
} from '../errors';
import { getDocument } from '../getDocument';
import { getDocumentView } from '../getDocumentView';
import {
  TestDocumentView,
  boardViewTypeConfig,
  cleanup,
  document1,
  documentFiles,
  setup,
} from '../test-utils';
import { createDocumentView } from './createDocumentView';

const view: TestDocumentView = {
  id: expect.any(String),
  type: 'board',
  blocks: [],
};

const MockFs = initializeMockFileSystem(documentFiles);

describe('createDocumentView', () => {
  beforeEach(() => {
    setup();

    DocumentsStore.getState().load([document1]);
    DocumentViewTypeConfigsStore.load([boardViewTypeConfig]);
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the document does not exist', async () => {
    await expect(createDocumentView('missing', 'board')).rejects.toThrow(
      DocumentViewNotFoundError,
    );
  });

  it('throws if the view type is not registered', async () => {
    await expect(createDocumentView(document1.id, 'invalid')).rejects.toThrow(
      DocumentViewTypeConfigNotRegisteredError,
    );
  });

  it('create the document view with custom type data', async () => {
    const documentView = await createDocumentView(document1.id, 'board');

    expect(documentView).toEqual(view);
  });

  it('adds the view to the store', async () => {
    const view = await createDocumentView(document1.id, 'board');

    expect(getDocumentView(view.id)).toEqual(view);
  });

  it('adds the view to the document', async () => {
    const view = await createDocumentView(document1.id, 'board');

    const document = getDocument(document1.id)!;

    expect(document.views).toContain(view.id);
  });

  it('dispatches a view create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('documents:view:create', 'test', (payload) => {
        expect(payload.data).toEqual(view);
        done();
      });

      createDocumentView(document1.id, 'board');
    }));
});
