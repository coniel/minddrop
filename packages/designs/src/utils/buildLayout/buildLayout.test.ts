import { describe, expect, it } from 'vitest';
import { buildLayout } from './buildLayout';

describe('buildLayout', () => {
  it('builds a layout of the given type with an empty root tree', () => {
    const layout = buildLayout('card');

    expect(layout.type).toBe('card');
    expect(layout.tree.type).toBe('root');
    expect(layout.tree.layoutType).toBe('card');
    expect(layout.tree.children).toEqual([]);
  });

  it('applies the layout type default frame', () => {
    const layout = buildLayout('page');

    expect(layout.frame).toEqual({ x: 0, y: 0, width: 800, height: 600 });
  });

  it('applies the given canvas position', () => {
    const layout = buildLayout('card', { position: { x: 100, y: 200 } });

    expect(layout.frame.x).toBe(100);
    expect(layout.frame.y).toBe(200);
  });

  it('uses the given name', () => {
    const layout = buildLayout('list', { name: 'My list' });

    expect(layout.name).toBe('My list');
  });

  it('seeds the root style with the layout type defaults', () => {
    const layout = buildLayout('space');

    expect(layout.tree.style.contentPadding).toBe('4');
  });
});
