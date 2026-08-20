import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Views } from '@minddrop/views';
import { Tab, TabHistoryEntry, TabView } from '../TabSetsStore';
import { createBlankTab } from '../createBlankTab';
import { resolveBreadcrumbTrail } from './resolveBreadcrumbTrail';

const RootViewName = 'test:view:root';
const BranchViewName = 'test:view:branch';
const LeafViewName = 'test:view:leaf';
const PassedThroughViewName = 'test:view:passed-through';

// Views of each breadcrumb level, rendering nothing
const views = [
  { type: RootViewName, breadcrumbLevel: 'root' as const },
  { type: BranchViewName, breadcrumbLevel: 'branch' as const },
  { type: LeafViewName, breadcrumbLevel: 'leaf' as const },
  { type: PassedThroughViewName, breadcrumbLevel: 'none' as const },
];

// A view passed through rather than navigated to, e.g. the search
// view a blank tab opens on
const passedThrough: TabView = {
  view: PassedThroughViewName,
  id: 'search',
  title: 'Search',
};

// The list view, e.g. a list of spaces
const root: TabView = { view: RootViewName, id: 'root', title: 'Root' };

// Entities containing other entities, e.g. spaces
const branch: TabView = {
  view: BranchViewName,
  id: 'branch-1',
  title: 'Branch 1',
};
const otherBranch: TabView = {
  view: BranchViewName,
  id: 'branch-2',
  title: 'Branch 2',
};

// Entities within a container, e.g. database entries
const leaf: TabView = { view: LeafViewName, id: 'leaf-1', title: 'Leaf 1' };
const otherLeaf: TabView = {
  view: LeafViewName,
  id: 'leaf-2',
  title: 'Leaf 2',
};
const thirdLeaf: TabView = {
  view: LeafViewName,
  id: 'leaf-3',
  title: 'Leaf 3',
};

describe('resolveBreadcrumbTrail', () => {
  beforeEach(() => {
    views.forEach((view) => Views.register({ ...view, component: () => null }));
  });

  afterEach(() => {
    Views.Store.clear();
  });

  it('returns an empty trail without a tab', () => {
    expect(resolveBreadcrumbTrail(null, 'main')).toEqual([]);
  });

  it('trails a branch opened from a root', () => {
    const trail = resolveBreadcrumbTrail(tab(branch, [root]), 'main');

    expect(trail).toEqual([
      { view: RootViewName, title: 'Root', icon: undefined, steps: 1 },
    ]);
  });

  it('stacks a leaf onto the views it was opened from', () => {
    const trail = resolveBreadcrumbTrail(tab(leaf, [root, branch]), 'main');

    expect(trail.map((crumb) => crumb.title)).toEqual(['Root', 'Branch 1']);
    expect(trail.map((crumb) => crumb.steps)).toEqual([2, 1]);
  });

  it('stacks leaves onto each other', () => {
    const trail = resolveBreadcrumbTrail(
      tab(otherLeaf, [branch, leaf]),
      'main',
    );

    expect(trail.map((crumb) => crumb.title)).toEqual(['Branch 1', 'Leaf 1']);
  });

  it('starts a new trail when a branch is opened from a leaf', () => {
    expect(resolveBreadcrumbTrail(tab(branch, [root, leaf]), 'main')).toEqual(
      [],
    );
  });

  it('starts a new trail when a branch is opened from a branch', () => {
    expect(
      resolveBreadcrumbTrail(tab(otherBranch, [root, branch]), 'main'),
    ).toEqual([]);
  });

  it('starts a new trail when a root is opened', () => {
    expect(resolveBreadcrumbTrail(tab(root, [branch, leaf]), 'main')).toEqual(
      [],
    );
  });

  it('never trails a view passed through on the way to another', () => {
    expect(resolveBreadcrumbTrail(tab(leaf, [passedThrough]), 'main')).toEqual(
      [],
    );
  });

  it('ends the trail at a view passed through', () => {
    const trail = resolveBreadcrumbTrail(
      tab(leaf, [passedThrough, branch]),
      'main',
    );

    expect(trail.map((crumb) => crumb.title)).toEqual(['Branch 1']);
  });

  it('ignores history entries in which the pane did not navigate', () => {
    const trail = resolveBreadcrumbTrail(
      tab(leaf, [root, branch, branch]),
      'main',
    );

    expect(trail.map((crumb) => crumb.title)).toEqual(['Root', 'Branch 1']);
  });

  it('trails the split pane through its own history', () => {
    const splitTab: Tab = {
      ...createBlankTab(),
      main: root,
      split: leaf,
      backHistory: [
        { main: root, split: branch, splitRatio: 50 },
      ] as TabHistoryEntry[],
    };

    const trail = resolveBreadcrumbTrail(splitTab, 'split');

    expect(trail.map((crumb) => crumb.title)).toEqual(['Branch 1']);
  });

  it('trails every ancestor of a deep stack', () => {
    const trail = resolveBreadcrumbTrail(
      tab(thirdLeaf, [root, branch, leaf, otherLeaf]),
      'main',
    );

    expect(trail.map((crumb) => crumb.title)).toEqual([
      'Root',
      'Branch 1',
      'Leaf 1',
      'Leaf 2',
    ]);
  });

  describe('subviews', () => {
    // The list view showing one of its entities
    const rootShowingA: TabView = {
      ...root,
      subview: { id: 'a', title: 'Entity A' },
    };
    const rootShowingB: TabView = {
      ...root,
      subview: { id: 'b', title: 'Entity B' },
    };

    it('trails the current view when it shows an entity within itself', () => {
      const trail = resolveBreadcrumbTrail(tab(rootShowingA, []), 'main');

      // The view's own crumb is not navigable, being the view shown
      expect(trail).toEqual([
        { view: RootViewName, title: 'Root', icon: undefined },
      ]);
    });

    it('trails the entity an ancestor showed', () => {
      const trail = resolveBreadcrumbTrail(tab(leaf, [rootShowingA]), 'main');

      expect(trail.map((crumb) => crumb.title)).toEqual(['Root', 'Entity A']);
      expect(trail.map((crumb) => crumb.steps)).toEqual([1, 1]);
    });

    it('drops the entity crumb of a subview opened in a view of its own', () => {
      // The branch shows what the root showed within itself, e.g. a
      // selected view expanded into a view of its own
      const expandedBranch: TabView = {
        ...branch,
        title: 'Entity A',
      };

      const trail = resolveBreadcrumbTrail(
        tab(expandedBranch, [rootShowingA]),
        'main',
      );

      expect(trail.map((crumb) => crumb.title)).toEqual(['Root']);
    });

    it('trails only the nearest entity a view showed', () => {
      const trail = resolveBreadcrumbTrail(
        tab(leaf, [rootShowingA, rootShowingB]),
        'main',
      );

      expect(trail.map((crumb) => crumb.title)).toEqual(['Root', 'Entity B']);
    });
  });
});

/**
 * Returns a tab showing the given main view, reached through the
 * given previously shown views.
 */
function tab(main: TabView, history: TabView[]): Tab {
  return {
    ...createBlankTab(),
    main,
    backHistory: history.map((view) => ({
      main: view,
      split: null,
      splitRatio: 50,
    })),
  };
}
