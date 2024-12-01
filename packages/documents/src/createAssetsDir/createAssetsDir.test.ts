import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  documentFiles,
  documents,
  document1,
  workspaceDir,
  wrappedDocument,
  childDocument,
} from '../test-utils';
import { createAssetsDir } from './createAssetsDir';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';

const MockFs = initializeMockFileSystem(documentFiles);

describe('createAssetsDir', () => {
  beforeEach(() => {
    setup();

    DocumentsStore.getState().load(documents);
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the document does not exist', async () => {
    expect(() => createAssetsDir('nonexistent')).rejects.toThrow(
      DocumentNotFoundError,
    );
  });

  describe('workspace level document', () => {
    it('creates the .minddrop directory in the parent/workspace directory if missing', async () => {
      await createAssetsDir(document1.id);

      const minddropDir = Fs.concatPath(workspaceDir, '.minddrop');

      expect(MockFs.exists(minddropDir)).toBe(true);
    });

    it('creates the assets directory in the parent/workspace directory and returns its path', async () => {
      const assetsDir = await createAssetsDir(document1.id);

      expect(assetsDir).toBe(
        Fs.concatPath(workspaceDir, '.minddrop', 'assets'),
      );

      expect(MockFs.exists(assetsDir)).toBe(true);
    });

    it('does not recreate the .minddrop directory if it already exists', async () => {
      const minddropDir = Fs.concatPath(workspaceDir, '.minddrop');

      MockFs.addFiles([minddropDir]);

      expect(createAssetsDir(document1.id)).resolves.not.toThrow();
    });

    it('does not recreate the assets directory if it already exists', async () => {
      const assetsDir = Fs.concatPath(workspaceDir, '.minddrop', 'assets');

      MockFs.addFiles([assetsDir]);

      expect(createAssetsDir(document1.id)).resolves.not.toThrow();
    });
  });

  describe('wrapped document', () => {
    it('creates the .minddrop directory in the parent/workspace directory if missing', async () => {
      await createAssetsDir(wrappedDocument.id);

      const minddropDir = Fs.concatPath(
        Fs.parentDirPath(wrappedDocument.path),
        '.minddrop',
      );

      expect(MockFs.exists(minddropDir)).toBe(true);
    });

    it('creates the assets directory in the parent/workspace directory and returns its path', async () => {
      const assetsDir = await createAssetsDir(wrappedDocument.id);

      expect(assetsDir).toBe(
        Fs.concatPath(
          Fs.parentDirPath(wrappedDocument.path),
          '.minddrop',
          'assets',
        ),
      );

      expect(MockFs.exists(assetsDir)).toBe(true);
    });

    it('does not recreate the .minddrop directory if it already exists', async () => {
      const minddropDir = Fs.concatPath(
        Fs.parentDirPath(wrappedDocument.path),
        '.minddrop',
      );

      MockFs.addFiles([minddropDir]);

      expect(createAssetsDir(wrappedDocument.id)).resolves.not.toThrow();
    });

    it('does not recreate the assets directory if it already exists', async () => {
      const assetsDir = Fs.concatPath(
        Fs.parentDirPath(wrappedDocument.path),
        '.minddrop',
        'assets',
      );

      MockFs.addFiles([assetsDir]);

      expect(createAssetsDir(wrappedDocument.id)).resolves.not.toThrow();
    });
  });

  describe('child document', () => {
    it('creates the .minddrop directory in the parent/workspace directory if missing', async () => {
      await createAssetsDir(childDocument.id);

      const minddropDir = Fs.concatPath(
        Fs.parentDirPath(childDocument.path),
        '.minddrop',
      );

      expect(MockFs.exists(minddropDir)).toBe(true);
    });

    it('creates the assets directory in the parent/workspace directory and returns its path', async () => {
      const assetsDir = await createAssetsDir(wrappedDocument.id);

      expect(assetsDir).toBe(
        Fs.concatPath(
          Fs.parentDirPath(childDocument.path),
          '.minddrop',
          'assets',
        ),
      );

      expect(MockFs.exists(assetsDir)).toBe(true);
    });

    it('does not recreate the .minddrop directory if it already exists', async () => {
      const minddropDir = Fs.concatPath(
        Fs.parentDirPath(childDocument.path),
        '.minddrop',
      );

      MockFs.addFiles([minddropDir]);

      expect(createAssetsDir(childDocument.id)).resolves.not.toThrow();
    });

    it('does not recreate the assets directory if it already exists', async () => {
      const assetsDir = Fs.concatPath(
        Fs.parentDirPath(childDocument.path),
        '.minddrop',
        'assets',
      );

      MockFs.addFiles([assetsDir]);

      expect(createAssetsDir(childDocument.id)).resolves.not.toThrow();
    });
  });
});
