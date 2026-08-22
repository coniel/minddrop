import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseDesign } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import {
  DesignPropertiesProvider,
  DesignPropertySchemasProvider,
} from './DesignPropertiesProvider';
import { cleanup, setup } from './test-utils';
import {
  useElementPlaceholder,
  useElementPlaceholderIcon,
  useElementPlaceholderImage,
} from './useElementPlaceholder';

const { design_books } = DesignFixtures;

// A design whose properties carry placeholders, which is what a
// designer sets to judge the look of their layout
const design_with_placeholders: DatabaseDesign = {
  ...design_books,
  properties: design_books.properties.map((property) => {
    if (property.name === 'Subtitle') {
      return { ...property, placeholder: 'A sample subtitle' };
    }

    if (property.name === 'Cover') {
      return { ...property, placeholder: 'sample-cover.png' };
    }

    return property;
  }),
};

// An element bound to the placeholder-carrying text property
const boundElement = { type: 'text', property: 'Subtitle' };

// An element bound to the placeholder-carrying image property
const boundImageElement = { type: 'image', property: 'Cover' };

describe('useElementPlaceholder', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('resolves a bound property placeholder in the studio', () => {
    renderInStudio(<PlaceholderConsumer />);

    screen.getByText('A sample subtitle');
  });

  it('resolves no placeholder during entry rendering', () => {
    // A placeholder is a design aid. Showing it for a real entry
    // whose value happens to be empty would read as real content.
    renderInEntry(<PlaceholderConsumer />);

    expect(screen.queryByText('A sample subtitle')).toBeNull();
    screen.getByTestId('placeholder');
    expect(screen.getByTestId('placeholder').textContent).toBe('');
  });

  it('resolves static content during entry rendering', () => {
    // Static content is the element's own real content, not a
    // stand-in for a missing value
    renderInEntry(
      <PlaceholderConsumer
        element={{ type: 'text', static: true, content: 'Fixed label' }}
      />,
    );

    screen.getByText('Fixed label');
  });

  it('resolves no placeholder image during entry rendering', () => {
    renderInStudio(<ImagePlaceholderConsumer />);
    screen.getByText('sample-cover.png');

    cleanupRender();

    renderInEntry(<ImagePlaceholderConsumer />);
    expect(screen.queryByText('sample-cover.png')).toBeNull();
  });

  it('resolves no placeholder icon during entry rendering', () => {
    renderInStudio(<IconPlaceholderConsumer />);
    screen.getByText('sample-cover.png');

    cleanupRender();

    renderInEntry(<IconPlaceholderConsumer />);
    expect(screen.queryByText('sample-cover.png')).toBeNull();
  });
});

/**
 * Renders children with the design's schemas only, as the studio
 * does, where placeholders belong.
 */
function renderInStudio(children: React.ReactNode) {
  return render(
    <DesignPropertySchemasProvider
      properties={design_with_placeholders.properties}
    >
      {children}
    </DesignPropertySchemasProvider>,
  );
}

/**
 * Renders children within an entry context, as a rendered entry
 * does, where placeholders must not appear.
 */
function renderInEntry(children: React.ReactNode) {
  return render(
    <DesignPropertySchemasProvider
      properties={design_with_placeholders.properties}
    >
      <DesignPropertiesProvider
        properties={design_with_placeholders.properties}
        propertyValues={{}}
        propertyMap={{}}
      >
        {children}
      </DesignPropertiesProvider>
    </DesignPropertySchemasProvider>,
  );
}

interface PlaceholderConsumerProps {
  /**
   * The element to resolve a placeholder for.
   */
  element?: Parameters<typeof useElementPlaceholder>[0];
}

/**
 * Displays the text placeholder resolved for an element.
 */
const PlaceholderConsumer: React.FC<PlaceholderConsumerProps> = ({
  element = boundElement,
}) => {
  const placeholder = useElementPlaceholder(element);

  return <span data-testid="placeholder">{placeholder}</span>;
};

/**
 * Displays the image placeholder resolved for an element.
 */
const ImagePlaceholderConsumer: React.FC = () => {
  const placeholder = useElementPlaceholderImage(boundImageElement);

  return <span data-testid="placeholder">{placeholder}</span>;
};

/**
 * Displays the icon placeholder resolved for an element.
 */
const IconPlaceholderConsumer: React.FC = () => {
  const placeholder = useElementPlaceholderIcon(boundImageElement);

  return <span data-testid="placeholder">{placeholder}</span>;
};
