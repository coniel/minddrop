import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, workspace1, workspace2 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { getParentWorkspace } from './getParentWorkspace';

describe('getParentWorkspace', () => {
  beforeEach(() => {
    setup();

    // Add a workspace to the store
    WorkspacesStore.getState().load([workspace1, workspace2]);
  });

  afterEach(cleanup);

  it('returns the parent workspace', () => {
    const documentPath = `${workspace2.path}/file.md`;
    const parentWorkspace = getParentWorkspace(documentPath);

    expect(parentWorkspace).toEqual(workspace2);
  });

  it('returns null if the parent workspace does not exist', () => {
    const documentPath = '/foo/bar/file.md';
    const parentWorkspace = getParentWorkspace(documentPath);

    expect(parentWorkspace).toBeNull();
  });

  it('does not match workspaces with similar paths', () => {
    const documentPath = `${workspace1.path}2/file.md`;
    const parentWorkspace = getParentWorkspace(documentPath);

    expect(parentWorkspace).toBeNull();
  });

  it('matches nested paths', () => {
    const documentPath = `${workspace2.path}/nested/file.md`;
    const parentWorkspace = getParentWorkspace(documentPath);

    expect(parentWorkspace).toEqual(workspace2);
  });

  it('does not match workspaces with a longer path than the child', () => {
    const documentPath = `${workspace2.path
      .split('/')
      .slice(0, -2)
      .join('/')}/file.md`;

    const parentWorkspace = getParentWorkspace(documentPath);

    expect(parentWorkspace).toBeNull();
  });
});
