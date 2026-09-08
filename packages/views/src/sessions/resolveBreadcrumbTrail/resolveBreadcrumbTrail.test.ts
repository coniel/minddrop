import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as Views from '../../Views';
import { SessionHistoryEntry, SessionView, ViewSession } from '../../types';
import { generateBlankViewSession } from '../generateBlankViewSession';
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
// view a blank session opens on.
const passedThrough: SessionView = {
  view: PassedThroughViewName,
  id: 'search',
  title: 'Search',
};

// The list view, e.g. a list of spaces.
const root: SessionView = { view: RootViewName, id: 'root', title: 'Root' };

// Entities containing other entities, e.g. spaces.
const branch: SessionView = {
  view: BranchViewName,
  id: 'branch-1',
  title: 'Branch 1',
};
const otherBranch: SessionView = {
  view: BranchViewName,
  id: 'branch-2',
  title: 'Branch 2',
};

// Entities within a container, e.g. database entries.
const leaf: SessionView = { view: LeafViewName, id: 'leaf-1', title: 'Leaf 1' };
const otherLeaf: SessionView = {
  view: LeafViewName,
  id: 'leaf-2',
  title: 'Leaf 2',
};
const thirdLeaf: SessionView = {
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

  it('returns an empty trail without a session', () => {
    expect(resolveBreadcrumbTrail(null, 'main')).toEqual([]);
  });

  it('trails a branch opened from a root', () => {
    const trail = resolveBreadcrumbTrail(session(branch, [root]), 'main');

    expect(trail).toEqual([
      {
        view: RootViewName,
        viewId: 'root',
        title: 'Root',
        contentIcon: undefined,
        steps: 1,
      },
    ]);
  });

  it('stacks a leaf onto the views it was opened from', () => {
    const trail = resolveBreadcrumbTrail(session(leaf, [root, branch]), 'main');

    expect(trail.map((crumb) => crumb.title)).toEqual(['Root', 'Branch 1']);
    expect(trail.map((crumb) => crumb.steps)).toEqual([2, 1]);
  });

  it('stacks leaves onto each other', () => {
    const trail = resolveBreadcrumbTrail(
      session(otherLeaf, [branch, leaf]),
      'main',
    );

    expect(trail.map((crumb) => crumb.title)).toEqual(['Branch 1', 'Leaf 1']);
  });

  it('starts a new trail when a branch is opened from a leaf', () => {
    expect(
      resolveBreadcrumbTrail(session(branch, [root, leaf]), 'main'),
    ).toEqual([]);
  });

  it('starts a new trail when a branch is opened from a branch', () => {
    expect(
      resolveBreadcrumbTrail(session(otherBranch, [root, branch]), 'main'),
    ).toEqual([]);
  });

  it('starts a new trail when a root is opened', () => {
    expect(
      resolveBreadcrumbTrail(session(root, [branch, leaf]), 'main'),
    ).toEqual([]);
  });

  it('starts a new trail when a view is opened from outside a view area', () => {
    // A leaf would normally stack onto the views it was opened from
    const sidebarLeaf: SessionView = { ...leaf, startsTrail: true };

    expect(
      resolveBreadcrumbTrail(session(sidebarLeaf, [root, branch]), 'main'),
    ).toEqual([]);
  });

  it('ends the trail at an ancestor opened from outside a view area', () => {
    const sidebarBranch: SessionView = { ...branch, startsTrail: true };

    const trail = resolveBreadcrumbTrail(
      session(leaf, [root, sidebarBranch]),
      'main',
    );

    expect(trail.map((crumb) => crumb.title)).toEqual(['Branch 1']);
  });

  it('never trails a view passed through on the way to another', () => {
    expect(
      resolveBreadcrumbTrail(session(leaf, [passedThrough]), 'main'),
    ).toEqual([]);
  });

  it('ends the trail at a view passed through', () => {
    const trail = resolveBreadcrumbTrail(
      session(leaf, [passedThrough, branch]),
      'main',
    );

    expect(trail.map((crumb) => crumb.title)).toEqual(['Branch 1']);
  });

  it('ignores history entries in which the pane did not navigate', () => {
    const trail = resolveBreadcrumbTrail(
      session(leaf, [root, branch, branch]),
      'main',
    );

    expect(trail.map((crumb) => crumb.title)).toEqual(['Root', 'Branch 1']);
  });

  it('trails the split pane through its own history', () => {
    const splitViewSession: ViewSession = {
      ...generateBlankViewSession(),
      main: root,
      split: leaf,
      backHistory: [
        { main: root, split: branch, splitRatio: 50 },
      ] as SessionHistoryEntry[],
    };

    const trail = resolveBreadcrumbTrail(splitViewSession, 'split');

    expect(trail.map((crumb) => crumb.title)).toEqual(['Branch 1']);
  });

  it('trails every ancestor of a deep stack', () => {
    const trail = resolveBreadcrumbTrail(
      session(thirdLeaf, [root, branch, leaf, otherLeaf]),
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
    const rootShowingA: SessionView = {
      ...root,
      subview: { id: 'a', title: 'Entity A' },
    };
    const rootShowingB: SessionView = {
      ...root,
      subview: { id: 'b', title: 'Entity B' },
    };

    it('trails the current view when it shows an entity within itself', () => {
      const trail = resolveBreadcrumbTrail(session(rootShowingA, []), 'main');

      // The view's own crumb is not navigable, being the view shown
      expect(trail).toEqual([
        {
          view: RootViewName,
          viewId: 'root',
          title: 'Root',
          contentIcon: undefined,
        },
      ]);
    });

    it('trails the entity an ancestor showed', () => {
      const trail = resolveBreadcrumbTrail(
        session(leaf, [rootShowingA]),
        'main',
      );

      expect(trail.map((crumb) => crumb.title)).toEqual(['Root', 'Entity A']);
      expect(trail.map((crumb) => crumb.steps)).toEqual([1, 1]);
    });

    it('drops the entity crumb of a subview opened in a view of its own', () => {
      // The branch shows what the root showed within itself, e.g. a
      // selected view expanded into a view of its own.
      const expandedBranch: SessionView = {
        ...branch,
        title: 'Entity A',
      };

      const trail = resolveBreadcrumbTrail(
        session(expandedBranch, [rootShowingA]),
        'main',
      );

      expect(trail.map((crumb) => crumb.title)).toEqual(['Root']);
    });

    it('trails only the nearest entity a view showed', () => {
      const trail = resolveBreadcrumbTrail(
        session(leaf, [rootShowingA, rootShowingB]),
        'main',
      );

      expect(trail.map((crumb) => crumb.title)).toEqual(['Root', 'Entity B']);
    });
  });
});

/**
 * Returns a session showing the given main view, reached through the
 * given previously shown views.
 */
function session(main: SessionView, history: SessionView[]): ViewSession {
  return {
    ...generateBlankViewSession(),
    main,
    backHistory: history.map((view) => ({
      main: view,
      split: null,
      splitRatio: 50,
    })),
  };
}
