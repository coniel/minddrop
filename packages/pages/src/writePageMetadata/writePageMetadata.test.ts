import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  initializeMockFileSystem,
  FileNotFoundError,
} from '@minddrop/file-system';
import { UserIcon, UserIconType } from '@minddrop/icons';
import { cleanup, page1, setup } from '../test-utils';
import { PagesStore } from '../PagesStore';
import { writePageMetadata } from './writePageMetadata';
import { serializePageMetadata } from '../utils';
import { DefaultPageIcon } from '../constants';
import { PageNotFoundError } from '../errors';

const PAGE_PATH = page1.path;
const NEW_PAGE_ICON: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'dog',
  color: 'red',
};
const SERIALIZED_METADATA = serializePageMetadata({ icon: page1.icon });
const SERIALIZED_NEW_METADATA = serializePageMetadata({ icon: NEW_PAGE_ICON });
const PAGE_CONTENT = '# Title\n\nContent';

const MockFs = initializeMockFileSystem([
  // Page file
  { path: PAGE_PATH, textContent: `${SERIALIZED_METADATA}${PAGE_CONTENT}` },
]);

describe('writePageMetadata', () => {
  beforeEach(() => {
    setup();

    // Load a page into the store
    PagesStore.getState().add(page1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the page does not exist', () => {
    // Attempt to write the metadata for a page that does not exist.
    // Should throw a InvalidParameterError.
    expect(() => writePageMetadata('missing')).rejects.toThrowError(
      PageNotFoundError,
    );
  });

  it('throws if the page file does not exist', () => {
    // Pretend page file does not exist
    MockFs.clear();

    // Attempt to write the metadata for a page missing its file.
    // Should throw a FileNotFoundError.
    expect(() => writePageMetadata(PAGE_PATH)).rejects.toThrowError(
      FileNotFoundError,
    );
  });

  it('writes the page metadata from the store state', async () => {
    // Update a page icon
    PagesStore.getState().update(PAGE_PATH, {
      icon: NEW_PAGE_ICON,
    });

    // Write the page metadata
    await writePageMetadata(PAGE_PATH);

    // Should write metadata to file
    expect(MockFs.readTextFile(PAGE_PATH)).toBe(
      `${SERIALIZED_NEW_METADATA}${PAGE_CONTENT}`,
    );
  });

  it('supports files with no metadata', async () => {
    // Pretend page file has no metadata
    MockFs.writeTextFile(PAGE_PATH, PAGE_CONTENT);

    // Update a page icon
    PagesStore.getState().update(PAGE_PATH, {
      icon: NEW_PAGE_ICON,
    });

    // Write the page metadata
    await writePageMetadata(PAGE_PATH);

    // Should write metadata to file
    expect(MockFs.readTextFile(PAGE_PATH)).toBe(
      `${SERIALIZED_NEW_METADATA}${PAGE_CONTENT}`,
    );
  });

  it('supports clearing metadata', async () => {
    // Update a page icon to the default one.
    // No metadata will be written as a result.
    PagesStore.getState().update(PAGE_PATH, {
      icon: DefaultPageIcon,
    });

    // Write the page metadata
    await writePageMetadata(PAGE_PATH);

    // Should write file containing on text content
    expect(MockFs.readTextFile(PAGE_PATH)).toBe(PAGE_CONTENT);
  });
});
