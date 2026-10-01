// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { pdfDocumentAnnotations_1 } from './annotations.fixtures';
import { resetPdfStores } from './resetPdfStores';

// The mock file system the workspace fixtures are set up on
const MockFs = initializeMockFileSystem();

// The date the tests run at
export const mockDate = new Date('2026-01-01T00:00:00.000Z');

/**
 * Sets up the workspace fixtures and loads the fixture annotations.
 */
export function setup(): void {
  // Freeze the clock at the mock date
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(mockDate);

  // Set up the workspace fixtures
  setupWorkspaceFixtures(MockFs);

  // Load the fixture annotations
  PdfAnnotationsStore.load([pdfDocumentAnnotations_1]);
}

/**
 * Clears the stores, events and fixtures the tests set up.
 */
export async function cleanup(): Promise<void> {
  // Restore the clock
  vi.useRealTimers();

  // Remove the test listeners
  await Events.tests.cleanup();

  // Clear the stores and the workspace fixtures
  resetPdfStores();
  cleanupWorkspaceFixtures();
}
