import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewFixtures, DataViewTypes } from '@minddrop/data-views';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { ElementsPalette } from './ElementsPalette';

const { dataViewType_table } = DataViewFixtures;

describe('<ElementsPalette />', () => {
  beforeEach(() => {
    setup();

    // Register a view type for the views group
    DataViewTypes.register(dataViewType_table);
  });

  afterEach(() => {
    cleanup();
    DataViewTypes.Store.clear();
  });

  it('renders all element groups by default', () => {
    render(<ElementsPalette />);

    // Items from every group are listed
    screen.getByText('design-studio.elements.text');
    screen.getByText('design-studio.elements.image');
    screen.getByText('design-studio.elements.container');

    // The views group is listed
    screen.getByText('design-studio.elements.group.views');
  });

  it('filters elements to the allowed types', () => {
    render(<ElementsPalette elementTypes={['text', 'container']} />);

    // Allowed types are listed
    screen.getByText('design-studio.elements.text');
    screen.getByText('design-studio.elements.container');

    // Other types are not
    expect(screen.queryByText('design-studio.elements.image')).toBeNull();

    // The media group is dropped entirely
    expect(screen.queryByText('design-studio.elements.group.media')).toBeNull();
  });

  it('hides the views group when views are disabled', () => {
    render(<ElementsPalette showViews={false} />);

    expect(screen.queryByText('design-studio.elements.group.views')).toBeNull();
  });
});
