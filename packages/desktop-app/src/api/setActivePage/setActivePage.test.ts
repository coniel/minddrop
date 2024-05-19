import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { PAGES_TEST_DATA } from '@minddrop/pages';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { setup, cleanup } from '../../test-utils';
import { setActivePage } from './setActivePage';
import { AppUiState } from '../../AppUiState';

const { page1 } = PAGES_TEST_DATA;

initializeMockFileSystem();

describe('setActivePage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets active view to "page"', () => {
    // Set an active page
    setActivePage(page1.path);

    // UI view state should be "page"
    expect(AppUiState.get('view')).toBe('page');
  });

  it('sets active resource path to the given path', () => {
    // Set an active page
    setActivePage(page1.path);

    // Active path should be the given path
    expect(AppUiState.get('path')).toBe(page1.path);
  });
});
