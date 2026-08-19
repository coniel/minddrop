import { afterEach, beforeEach, describe, it } from 'vitest';
import {
  DatabaseDesign,
  DesignFixtures,
  resolveDesignMediaDirPath,
} from '@minddrop/designs';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { useMediaDirPath } from '../MediaDirContext';
import { cleanup, setup } from '../test-utils';
import { useElementPlaceholder } from '../useElementPlaceholder';
import { DesignStudioScope } from './DesignStudioScope';

const { design_books, design_space_virtual } = DesignFixtures;

// The design's title property, carrying a placeholder for elements
// bound to it to display
const design_with_placeholder: DatabaseDesign = {
  ...design_books,
  properties: design_books.properties.map((property) => {
    if (property.name === 'Title') {
      return { ...property, placeholder: 'Book title' };
    }

    return property;
  }),
};

describe('<DesignStudioScope />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('resolves placeholders from the open design properties', () => {
    renderScope(design_with_placeholder, <PlaceholderConsumer />);

    // The bound property's placeholder is what the element displays
    screen.getByText('Book title');
  });

  it('provides the design media directory', () => {
    renderScope(design_books, <MediaDirConsumer />);

    screen.getByText(resolveDesignMediaDirPath(design_books.id));
  });

  it('provides no properties for designs which have none', () => {
    renderScope(design_space_virtual, <PlaceholderConsumer />);

    // With no property to resolve, the element falls back to the
    // bound property's name
    screen.getByText('Title');
  });
});

/**
 * Renders children within the scope of the given design.
 */
function renderScope(
  design: Parameters<typeof DesignStudioScope>[0]['design'],
  children: React.ReactNode,
) {
  const studio = createDesignStudioStore();

  studio.initialize(design);

  return render(
    <DesignStudioProvider store={studio}>
      <DesignStudioScope design={design}>{children}</DesignStudioScope>
    </DesignStudioProvider>,
  );
}

/**
 * Displays the placeholder resolved for an element bound to the
 * design's title property.
 */
const PlaceholderConsumer: React.FC = () => {
  const placeholder = useElementPlaceholder({
    type: 'text',
    property: 'Title',
  });

  return <span>{placeholder}</span>;
};

/**
 * Displays the media directory path in scope.
 */
const MediaDirConsumer: React.FC = () => {
  const mediaDirPath = useMediaDirPath();

  return <span>{mediaDirPath}</span>;
};
