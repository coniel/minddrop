import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { DOCUMENTS_TEST_DATA } from '@minddrop/documents';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { setup, cleanup } from '../../test-utils';
import { setActiveDocument } from './setActiveDocument';
import { AppUiState } from '../../AppUiState';

const { document1 } = DOCUMENTS_TEST_DATA;

initializeMockFileSystem();

describe('setActiveDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets active view to "document"', () => {
    // Set an active document
    setActiveDocument(document1.path);

    // UI view state should be "document"
    expect(AppUiState.get('view')).toBe('document');
  });

  it('sets active resource path to the given path', () => {
    // Set an active document
    setActiveDocument(document1.path);

    // Active path should be the given path
    expect(AppUiState.get('path')).toBe(document1.path);
  });
});
