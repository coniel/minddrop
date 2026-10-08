import { afterAll, mock } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createElectrobunStub } from './createElectrobunStub';

/**
 * Replaces the `electrobun/bun` module with a stub.
 *
 * Must be called before importing the module under test.
 *
 * `mock.module` is process-wide. The replacement applies to every test
 * file `bun test` runs in the same process. A module which already
 * imported the stub keeps it after a later call replaces the mock.
 */
export function mockElectrobun(): void {
  // Create a temporary directory for the stub's base directories
  const baseDir = mkdtempSync(
    path.join(os.tmpdir(), 'minddrop-electrobun-stub-'),
  );

  // Replace the module with the stub
  mock.module('electrobun/bun', () => createElectrobunStub(baseDir));

  // Remove the temporary directory after the test file's tests
  afterAll(() => {
    rmSync(baseDir, { recursive: true, force: true });
  });
}
