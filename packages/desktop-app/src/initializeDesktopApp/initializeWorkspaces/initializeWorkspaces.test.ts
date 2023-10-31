import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FileNotFoundError,
  JsonParseError,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { Workspaces, WORKSPACES_TEST_DATA } from '@minddrop/workspaces';
import { AppUiState } from '../../AppUiState';
import { initializeWorkspaces } from './initializeWorkspaces';

const { workspace1 } = WORKSPACES_TEST_DATA;

const mocks = vi.hoisted(() => {
  return {
    Workspaces: {
      load: vi.fn(),
      getAll: vi.fn(),
      hasValidWorkspace: vi.fn().mockReturnValue(true),
    },
  };
});

vi.mock('@minddrop/workspaces', async () => {
  const actual = await vi.importActual<{}>('@minddrop/workspaces');

  return {
    ...actual,
    Workspaces: mocks.Workspaces,
  };
});

registerFileSystemAdapter(MockFsAdapter);

describe('initializeWorkspaces', () => {
  afterEach(() => {
    // Reset view
    AppUiState.set('view', null);
  });

  beforeEach(() => {
    // Pretend config contains a workspce
    vi.mocked(Workspaces.getAll).mockReturnValue([workspace1]);
  });

  it('sets view to `create-first-workspace` if load throw FileNotFoundError', () => {
    // Pretend workspaces config file does not exist
    vi.mocked(Workspaces.load).mockImplementation(() => {
      throw new FileNotFoundError('config');
    });

    // Initialize workspaces
    initializeWorkspaces();

    // Should set view to 'create-first-workspace'
    expect(AppUiState.get('view')).toBe('create-first-workspace');
  });

  it('sets view to `create-first-workspace` if load throw JsonParseError', () => {
    // Pretend workspaces config could not be parsed
    vi.mocked(Workspaces.load).mockImplementation(() => {
      throw new JsonParseError('foo');
    });

    // Initialize workspaces
    initializeWorkspaces();

    // Should set view to 'create-first-workspace'
    expect(AppUiState.get('view')).toBe('create-first-workspace');
  });

  it('sets view to `create-first-workspace` if config contains no workspaces', () => {
    // Pretend workspaces config contains no workspaces
    vi.mocked(Workspaces.getAll).mockReturnValue([]);

    // Initialize workspaces
    initializeWorkspaces();

    // Should set view to 'create-first-workspace'
    expect(AppUiState.get('view')).toBe('create-first-workspace');
  });

  it('sets view to `no-valid-workspace` if config contains no workspaces', () => {
    // Pretend workspaces config contains no workspaces
    vi.mocked(Workspaces.hasValidWorkspace).mockReturnValue(false);

    // Initialize workspaces
    initializeWorkspaces();

    // Should set view to 'no-valid-workspace'
    expect(AppUiState.get('view')).toBe('no-valid-workspace');
  });
});
