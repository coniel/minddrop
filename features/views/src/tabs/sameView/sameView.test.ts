import { describe, expect, it } from 'vitest';
import { sameView } from './sameView';

describe('sameView', () => {
  it('matches two empty panes', () => {
    expect(sameView(null, null)).toBe(true);
  });

  it('does not match an empty pane against a view', () => {
    expect(sameView(null, { view: 'a' })).toBe(false);
    expect(sameView({ view: 'a' }, null)).toBe(false);
  });

  it('matches views with the same type, id and props', () => {
    expect(
      sameView(
        { view: 'a', id: 'a:1', props: { foo: 'bar' } },
        { view: 'a', id: 'a:1', props: { foo: 'bar' } },
      ),
    ).toBe(true);
  });

  it('does not match views differing in type, id or props', () => {
    expect(sameView({ view: 'a' }, { view: 'b' })).toBe(false);
    expect(sameView({ view: 'a', id: 'a:1' }, { view: 'a', id: 'a:2' })).toBe(
      false,
    );
    expect(
      sameView(
        { view: 'a', id: 'a:1', props: { foo: 'bar' } },
        { view: 'a', id: 'a:1', props: { foo: 'baz' } },
      ),
    ).toBe(false);
  });

  it('ignores display metadata differences', () => {
    expect(
      sameView(
        { view: 'a', id: 'a:1', title: 'Old', icon: 'icon-old' },
        { view: 'a', id: 'a:1', title: 'New', icon: 'icon-new' },
      ),
    ).toBe(true);
  });
});
