import { afterEach, describe, expect, it } from 'vitest';
import {
  getActiveWorkspaceScope,
  setActiveWorkspaceScope,
  subscribeToActiveWorkspaceScope,
} from './workspaceScope';

describe('workspaceScope', () => {
  afterEach(() => {
    setActiveWorkspaceScope(null);
  });

  it('has no active workspace by default', () => {
    expect(getActiveWorkspaceScope()).toBeNull();
  });

  it('returns the workspace which was set active', () => {
    setActiveWorkspaceScope('workspace-1');

    expect(getActiveWorkspaceScope()).toBe('workspace-1');
  });

  describe('subscribeToActiveWorkspaceScope', () => {
    it('calls the callback with each new active workspace', () => {
      const changes: (string | null)[] = [];
      const unsubscribe = subscribeToActiveWorkspaceScope((workspaceId) => {
        changes.push(workspaceId);
      });

      setActiveWorkspaceScope('workspace-1');
      setActiveWorkspaceScope(null);
      unsubscribe();

      expect(changes).toEqual(['workspace-1', null]);
    });

    it('does not call the callback when the workspace is set again', () => {
      const changes: (string | null)[] = [];

      setActiveWorkspaceScope('workspace-1');

      const unsubscribe = subscribeToActiveWorkspaceScope((workspaceId) => {
        changes.push(workspaceId);
      });

      setActiveWorkspaceScope('workspace-1');
      unsubscribe();

      expect(changes).toEqual([]);
    });

    it('stops calling the callback once unsubscribed', () => {
      const changes: (string | null)[] = [];
      const unsubscribe = subscribeToActiveWorkspaceScope((workspaceId) => {
        changes.push(workspaceId);
      });

      unsubscribe();
      setActiveWorkspaceScope('workspace-1');

      expect(changes).toEqual([]);
    });
  });
});
