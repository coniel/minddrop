import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../../../test-utils';
import { PropertyDesignElement } from '../PropertyDesignElement';

const { element_property_collection_1 } = DesignFixtures;

describe('<CollectionPropertyRenderer />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders the selected variant view type skeleton while unmapped', () => {
    const { container } = render(
      <PropertyDesignElement element={element_property_collection_1} />,
    );

    // The gallery default resolves its registered view type, so
    // the placeholder notice is not shown
    expect(
      container.querySelector('.designs-collection-element'),
    ).not.toBeNull();
    expect(screen.queryByText('designsStudio.view.placeholder')).toBeNull();
  });

  it('falls back to the default variant for unknown selections', () => {
    const { container } = render(
      <PropertyDesignElement
        element={{ ...element_property_collection_1, variant: 'unknown' }}
      />,
    );

    // Unknown selections resolve to the default variant, whose
    // registered view type renders as usual
    expect(
      container.querySelector('.designs-collection-element'),
    ).not.toBeNull();
    expect(screen.queryByText('designsStudio.view.placeholder')).toBeNull();
  });
});
