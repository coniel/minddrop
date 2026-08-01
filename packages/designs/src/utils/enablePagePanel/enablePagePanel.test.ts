import { describe, expect, it } from 'vitest';
import { layout_page_1 } from '../../test-utils';
import { getPanelRegions } from '../getPanelRegions';
import { isPanelledRoot } from '../isPanelledRoot';
import { enablePagePanel } from './enablePagePanel';

const base = layout_page_1.tree;

describe('enablePagePanel', () => {
  it('wraps free-form children into a content region', () => {
    const root = enablePagePanel(base, 'left');

    const { content } = getPanelRegions(root);

    expect(content?.role).toBe('content');
    expect(content?.children).toEqual(base.children);
  });

  it('adds a panel on the requested side', () => {
    const root = enablePagePanel(base, 'left');

    const { left } = getPanelRegions(root);

    expect(left?.type).toBe('page-panel');
    expect(left?.side).toBe('left');
  });

  it('puts the root into panelled mode with a row layout', () => {
    const root = enablePagePanel(base, 'left');

    expect(isPanelledRoot(root)).toBe(true);
    expect(root.style.direction).toBe('row');
  });

  it('orders regions as left, content, right', () => {
    const root = enablePagePanel(enablePagePanel(base, 'left'), 'right');

    expect(root.children.map((child) => child.type)).toEqual([
      'page-panel',
      'container',
      'page-panel',
    ]);
  });

  it('keeps a single content region when adding a second panel', () => {
    const root = enablePagePanel(enablePagePanel(base, 'left'), 'right');

    const contentRegions = root.children.filter(
      (child) => child.type === 'container' && child.role === 'content',
    );

    expect(contentRegions).toHaveLength(1);
  });

  it('returns the root unchanged when the side already has a panel', () => {
    const root = enablePagePanel(base, 'left');

    expect(enablePagePanel(root, 'left')).toBe(root);
  });
});
