import { describe, expect, it } from 'vitest';
import { SessionView } from '../../types';
import { applyViewUpdate } from './applyViewUpdate';

const sessionView: SessionView = {
  view: 'db:view',
  id: 'db:a',
  props: { databaseId: 'a' },
  title: 'A',
  contentIcon: 'icon-a',
};

describe('applyViewUpdate', () => {
  it('applies the id, props, title and icon when the view matches', () => {
    const updated = applyViewUpdate(sessionView, 'db:a', {
      id: 'db:b',
      props: { databaseId: 'b' },
      title: 'B',
      icon: 'icon-b',
    });

    expect(updated).toEqual({
      view: 'db:view',
      id: 'db:b',
      props: { databaseId: 'b' },
      title: 'B',
      contentIcon: 'icon-b',
    });
  });

  it('merges props into the existing props', () => {
    const updated = applyViewUpdate(sessionView, 'db:a', {
      props: { extra: true },
    });

    expect(updated?.props).toEqual({ databaseId: 'a', extra: true });
  });

  it('returns the session view unchanged when it does not match', () => {
    expect(applyViewUpdate(sessionView, 'db:other', { title: 'X' })).toBe(
      sessionView,
    );
  });

  it('returns null for a null session view', () => {
    expect(applyViewUpdate(null, 'db:a', { title: 'X' })).toBeNull();
  });
});
