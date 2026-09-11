import { afterEach, describe, expect, it } from 'vitest';
import { setActiveWorkspaceScope } from '../workspaceScope';
import { createStoreRecords } from './createStoreRecords';

type TestRecord = { value: string };

const empty: TestRecord = { value: 'empty' };
const record1: TestRecord = { value: 'one' };
const record2: TestRecord = { value: 'two' };

// Creates records which collect what they mirror into the store state
function createTestRecords(scope?: 'workspace') {
  const mirrored: TestRecord[] = [];
  const records = createStoreRecords<TestRecord>(
    scope,
    () => empty,
    (record) => mirrored.push(record),
  );

  return { records, mirrored };
}

describe('createStoreRecords', () => {
  afterEach(() => {
    setActiveWorkspaceScope(null);
  });

  describe('unscoped', () => {
    it('resolves no workspace, whatever is active', () => {
      const { records } = createTestRecords();

      setActiveWorkspaceScope('workspace-1');

      expect(records.resolveWorkspaceId()).toBeUndefined();
      expect(records.resolveWorkspaceId('workspace-2')).toBeUndefined();
    });

    it('returns the empty record before anything is set', () => {
      const { records } = createTestRecords();

      expect(records.get()).toBe(empty);
    });

    it('keeps a single record, whatever workspace is active', () => {
      const { records } = createTestRecords();

      records.set(record1);
      setActiveWorkspaceScope('workspace-1');

      expect(records.get()).toBe(record1);
    });

    it('mirrors every set record', () => {
      const { records, mirrored } = createTestRecords();

      records.set(record1);

      expect(mirrored).toEqual([record1]);
    });
  });

  describe('scoped by workspace', () => {
    it('resolves the given workspace over the active one', () => {
      const { records } = createTestRecords('workspace');

      setActiveWorkspaceScope('workspace-1');

      expect(records.resolveWorkspaceId('workspace-2')).toBe('workspace-2');
    });

    it('resolves the active workspace when none is given', () => {
      const { records } = createTestRecords('workspace');

      setActiveWorkspaceScope('workspace-1');

      expect(records.resolveWorkspaceId()).toBe('workspace-1');
    });

    it('resolves no workspace when none is active', () => {
      const { records } = createTestRecords('workspace');

      expect(records.resolveWorkspaceId()).toBeUndefined();
    });

    it('keeps a record per workspace', () => {
      const { records } = createTestRecords('workspace');

      records.set(record1, 'workspace-1');
      records.set(record2, 'workspace-2');

      expect(records.get('workspace-1')).toBe(record1);
      expect(records.get('workspace-2')).toBe(record2);
    });

    it('reads and writes the active workspace by default', () => {
      const { records } = createTestRecords('workspace');

      setActiveWorkspaceScope('workspace-1');
      records.set(record1);
      setActiveWorkspaceScope('workspace-2');
      records.set(record2);

      expect(records.get()).toBe(record2);
      expect(records.get('workspace-1')).toBe(record1);
    });

    it('returns the empty record for a workspace with none', () => {
      const { records } = createTestRecords('workspace');

      expect(records.get('workspace-1')).toBe(empty);
    });

    it('keeps a default record while no workspace is active', () => {
      const { records } = createTestRecords('workspace');

      records.set(record1);
      setActiveWorkspaceScope('workspace-1');

      expect(records.get()).toBe(empty);

      setActiveWorkspaceScope(null);

      expect(records.get()).toBe(record1);
    });

    it('mirrors writes to the active workspace only', () => {
      setActiveWorkspaceScope('workspace-1');

      const { records, mirrored } = createTestRecords('workspace');

      records.set(record1, 'workspace-1');
      records.set(record2, 'workspace-2');

      expect(mirrored).toEqual([record1]);
    });

    it('mirrors the newly active record when the active workspace changes', () => {
      const { records, mirrored } = createTestRecords('workspace');

      records.set(record2, 'workspace-2');
      setActiveWorkspaceScope('workspace-2');

      expect(mirrored).toEqual([record2]);
    });

    it('mirrors the empty record when the active workspace has none', () => {
      const { mirrored } = createTestRecords('workspace');

      setActiveWorkspaceScope('workspace-2');

      expect(mirrored).toEqual([empty]);
    });

    describe('drop', () => {
      it('drops the workspace record', () => {
        const { records } = createTestRecords('workspace');

        records.set(record1, 'workspace-1');
        records.drop('workspace-1');

        expect(records.get('workspace-1')).toBe(empty);
      });

      it('leaves other workspace records in place', () => {
        const { records } = createTestRecords('workspace');

        records.set(record1, 'workspace-1');
        records.set(record2, 'workspace-2');
        records.drop('workspace-1');

        expect(records.get('workspace-2')).toBe(record2);
      });

      it('mirrors the empty record when dropping the active workspace', () => {
        setActiveWorkspaceScope('workspace-1');

        const { records, mirrored } = createTestRecords('workspace');

        records.set(record1);
        records.drop('workspace-1');

        expect(mirrored).toEqual([record1, empty]);
      });

      it('does not mirror when dropping another workspace', () => {
        setActiveWorkspaceScope('workspace-1');

        const { records, mirrored } = createTestRecords('workspace');

        records.set(record2, 'workspace-2');
        records.drop('workspace-2');

        expect(mirrored).toEqual([]);
      });
    });
  });
});
