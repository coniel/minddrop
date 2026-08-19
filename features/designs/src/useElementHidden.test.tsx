import { afterEach, beforeEach, describe, it } from 'vitest';
import { DesignElement, DesignFixtures, TextElement } from '@minddrop/designs';
import { PropertyMap } from '@minddrop/properties';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from './DesignPropertiesProvider';
import { cleanup, setup } from './test-utils';
import { useElementHidden } from './useElementHidden';

const { design_books, element_text_1 } = DesignFixtures;

describe('useElementHidden', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('hides a bound element whose property is empty', () => {
    const element: TextElement = { ...element_text_1, property: 'Subtitle' };

    renderHidden(element);

    screen.getByText('hidden');
  });

  it('shows a bound element whose property has a value', () => {
    const element: TextElement = { ...element_text_1, property: 'Subtitle' };

    renderHidden(element, { Subtitle: 'A subtitle' });

    screen.getByText('shown');
  });

  it('shows a static element with no value', () => {
    // Static content is the element's own, so an empty bound
    // property has no bearing on it
    const element: TextElement = {
      ...element_text_1,
      static: true,
      content: '',
    };

    renderHidden(element);

    screen.getByText('shown');
  });

  it('never hides element types whose empty state is expected', () => {
    // An empty editor is where writing starts, so it must survive
    // an empty property rather than vanishing from the entry
    const element = {
      ...element_text_1,
      type: 'editor',
      property: 'Summary',
    } as DesignElement;

    renderHidden(element);

    screen.getByText('shown');
  });

  it('hides embed element types whose property is empty', () => {
    // An entry with no URL has no page to embed
    const element = {
      ...element_text_1,
      type: 'webview',
      property: 'Subtitle',
    } as DesignElement;

    renderHidden(element);

    screen.getByText('hidden');
  });

  it('never hides outside of entry rendering', () => {
    const element: TextElement = { ...element_text_1, property: 'Subtitle' };

    // Rendered without an entry context, as in the studio, where
    // every element stays visible and selectable
    render(<HiddenConsumer element={element} />);

    screen.getByText('shown');
  });
});

/**
 * Renders the element's hidden state within an entry context,
 * where empty behaviour applies.
 */
function renderHidden(
  element: DesignElement,
  propertyValues: PropertyMap = {},
) {
  return render(
    <DesignPropertiesProvider
      properties={design_books.properties}
      propertyValues={propertyValues}
      propertyMap={{ [element.id]: element.property ?? '' }}
    >
      <HiddenConsumer element={element} />
    </DesignPropertiesProvider>,
  );
}

interface HiddenConsumerProps {
  /**
   * The element whose hidden state to display.
   */
  element: DesignElement;
}

/**
 * Displays whether the element is hidden in the current render.
 */
const HiddenConsumer: React.FC<HiddenConsumerProps> = ({ element }) => {
  const hidden = useElementHidden(element);

  return <span>{hidden ? 'hidden' : 'shown'}</span>;
};
