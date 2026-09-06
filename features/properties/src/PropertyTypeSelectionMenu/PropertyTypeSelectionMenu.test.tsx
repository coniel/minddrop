import { afterEach, describe, expect, it, vi } from 'vitest';
import { Properties } from '@minddrop/properties';
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
        <button>Open</button>
      </PropertyTypeSelectionMenu>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('Open'));

    expect(screen.getByText(Properties.schemas.text.name)).toBeVisible();
  });

  it('omits meta properties if in existing properties', () => {
    render(
      <PropertyTypeSelectionMenu
        defaultOpen
        onSelect={onSelect}
        existingProperties={[
          Properties.schemas.text,
          Properties.schemas.title,
          Properties.schemas.created,
        ]}
      >
        <button>Open</button>
      </PropertyTypeSelectionMenu>,
    );

    // Should preserve non-meta properties
    expect(screen.queryByText(Properties.schemas.text.name)).not.toBeNull();
    // Should omit meta properties
    expect(screen.queryByText(Properties.schemas.title.name)).toBeNull();
    expect(screen.queryByText(Properties.schemas.created.name)).toBeNull();
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
