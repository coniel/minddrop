import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CreatedPropertySchema,
  TextPropertySchema,
} from '@minddrop/properties';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { PropertyTypeSelectionMenu } from './PropertyTypeSelectionMenu';

const onSelect = vi.fn();

describe('<PropertyTypeSelectionMenu />', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('opens the menu when triggered', async () => {
    render(
      <PropertyTypeSelectionMenu onSelect={onSelect}>
        {(props) => <button {...props}>Open</button>}
      </PropertyTypeSelectionMenu>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('Open'));

    expect(screen.getByText(TextPropertySchema.name)).toBeVisible();
  });

  it('omits meta properties if in existing properties', () => {
    render(
      <PropertyTypeSelectionMenu
        defaultOpen
        onSelect={onSelect}
        existingProperties={[TextPropertySchema, CreatedPropertySchema]}
      >
        {(props) => <button {...props}>Open</button>}
      </PropertyTypeSelectionMenu>,
    );

    // Should preserve non-meta properties
    expect(screen.queryByText(TextPropertySchema.name)).not.toBeNull();
    // Should omit meta properties
    expect(screen.queryByText(CreatedPropertySchema.name)).toBeNull();
  });

  it('calls onSelect when a property type is selected', async () => {
    render(
      <PropertyTypeSelectionMenu defaultOpen onSelect={onSelect}>
        {(props) => <button {...props}>Open</button>}
      </PropertyTypeSelectionMenu>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText(TextPropertySchema.name));

    expect(onSelect).toHaveBeenCalledWith(TextPropertySchema);
  });
});
