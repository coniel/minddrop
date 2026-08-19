import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { createDesignStudioStore } from '../../DesignStudioStore';
import { cleanup, setup } from '../../test-utils';
import { FlatRootDesignElement } from '../../types';
import { hasPagePanels } from './hasPagePanels';

const { design_books, layout_page_1 } = DesignFixtures;

describe('hasPagePanels', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('detects a docked page panel', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(layout_page_1.id);

    // No panels docked yet
    expect(readRoot(studio)).toSatisfy(
      (root: FlatRootDesignElement) => !hasPagePanels(studio, root),
    );

    // Dock a panel
    studio.addPagePanel('left');

    expect(hasPagePanels(studio, readRoot(studio))).toBe(true);
  });
});

/**
 * Reads the active layout's root element.
 */
function readRoot(
  studio: ReturnType<typeof createDesignStudioStore>,
): FlatRootDesignElement {
  return studio.getDesignElement<FlatRootDesignElement>('root');
}
