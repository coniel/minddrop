import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  setup,
  cleanup,
  document1,
  documentFiles,
  boardViewTypeConfig,
  TestDocumentView,
} from '../test-utils';
import { createDocumentView } from './createDocumentView';
import { getDocumentView } from '../getDocumentView';
import { getDocument } from '../getDocument';
import {
  DocumentViewNotFoundError,
  DocumentViewTypeConfigNotRegisteredError,
} from '../errors';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';
import { Events } from '@minddrop/events';

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
