import { afterEach, describe, expect, it, vi } from 'vitest';
import { Properties, PropertySchemaTemplate } from '@minddrop/properties';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { PropertyTypeSelectionMenu } from './PropertyTypeSelectionMenu';

const onSelect = vi.fn();

describe('<PropertyTypeSelectionMenu />', () => {
  afterEach(cleanup);

  it('opens the menu when triggered', async () => {
    render(
      <PropertyTypeSelectionMenu onSelect={onSelect}>
        <button>Open</button>
      </PropertyTypeSelectionMenu>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('Open'));

    expect(screen.getByText(Properties.schemas.text.name)).toBeVisible();
  });

  it('omits singleton properties if in existing properties', () => {
    render(
      <PropertyTypeSelectionMenu
        defaultOpen
        onSelect={onSelect}
        existingProperties={[
          Properties.schemas.text,
          Properties.schemas.title,
          Properties.schemas.created,
          Properties.schemas.content,
        ]}
      >
        <button>Open</button>
      </PropertyTypeSelectionMenu>,
    );

    // Should preserve non-singleton properties
    expect(screen.queryByText(Properties.schemas.text.name)).not.toBeNull();
    // Should omit meta singleton properties
    expect(screen.queryByText(Properties.schemas.title.name)).toBeNull();
    expect(screen.queryByText(Properties.schemas.created.name)).toBeNull();
    // Should omit non-meta singleton properties
    expect(screen.queryByText(Properties.schemas.content.name)).toBeNull();
  });

  it('lists the singleton properties below the metadata properties', () => {
    render(
      <PropertyTypeSelectionMenu defaultOpen onSelect={onSelect}>
        <button>Open</button>
      </PropertyTypeSelectionMenu>,
    );

    const items = screen.getAllByRole('menuitem');
    const indexOf = (schema: PropertySchemaTemplate) =>
      items.findIndex((item) => item.contains(screen.getByText(schema.name)));
    const lastMetaIndex = Math.max(
      ...Object.values(Properties.schemas)
        .filter((schema) => schema.meta)
        .map(indexOf),
    );
    const firstRegularIndex = indexOf(Properties.schemas.text);

    [Properties.schemas.content, Properties.schemas.icon].forEach((schema) => {
      // Comes below every metadata property
      expect(indexOf(schema)).toBeGreaterThan(lastMetaIndex);
      // And ahead of the regular property types
      expect(indexOf(schema)).toBeLessThan(firstRegularIndex);
    });
  });

  it('calls onSelect when a property type is selected', async () => {
    render(
      <PropertyTypeSelectionMenu defaultOpen onSelect={onSelect}>
        <button>Open</button>
      </PropertyTypeSelectionMenu>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText(Properties.schemas.text.name));

    expect(onSelect).toHaveBeenCalledWith(Properties.schemas.text);
  });
});
