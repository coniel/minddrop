import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { LayoutRenderer } from './LayoutRenderer';

const { design_books, layout_card_1 } = DesignFixtures;

describe('<LayoutRenderer />', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('renders the layout element tree', () => {
    render(<LayoutRenderer layout={layout_card_1} />);

    // The fixture layout contains a static text element whose
    // content is the layout ID
    screen.getByText(layout_card_1.id);
  });

  it('renders elements addressable by their element ID', () => {
    const { container } = render(<LayoutRenderer layout={layout_card_1} />);

    // The root element div carries the root's data attribute
    expect(container.querySelector('[data-element-id="root"]')).not.toBeNull();
  });

  it('renders bound property values over placeholders', () => {
    // Bind the layout's text element to a property with a value
    const boundLayout = {
      ...layout_card_1,
      tree: {
        ...layout_card_1.tree,
        children: layout_card_1.tree.children.map((child) => {
          if (child.type === 'text') {
            return { ...child, static: false, property: 'Subtitle' };
          }

          return child;
        }),
      },
    };

    render(
      <LayoutRenderer
        layout={boundLayout}
        designProperties={design_books.properties}
        properties={design_books.properties}
        propertyValues={{ Subtitle: 'A bound subtitle' }}
        propertyMap={Object.fromEntries(
          boundLayout.tree.children
            .filter((child) => child.type === 'text')
            .map((child) => [child.id, 'Subtitle']),
        )}
      />,
    );

    // The bound value renders in place of the static content
    screen.getByText('A bound subtitle');
  });
});
