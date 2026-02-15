import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { ToggleGroup } from './ToggleGroup';
import { ToggleGroupButton } from './ToggleGroupButton';

describe('<ToggleGroup />', () => {
  afterEach(cleanup);

  it('calls onValueChange when the value changes', async () => {
    const onValueChange = vi.fn();

    render(
      <ToggleGroup value="value-1" onValueChange={onValueChange}>
        <ToggleGroupButton label="" value="value-1">
          Value 1
        </ToggleGroupButton>
        <ToggleGroupButton label="" value="value-2">
          Value 2
        </ToggleGroupButton>
      </ToggleGroup>,
    );

    await userEvent.click(screen.getByText('Value 2'));

    expect(onValueChange).toHaveBeenCalledWith('value-2');
  });

  it('prevents empty values', async () => {
    const onValueChange = vi.fn();

    render(
      <ToggleGroup value="value-2" onValueChange={onValueChange}>
        <ToggleGroupButton label="" value="value-1">
          Value 1
        </ToggleGroupButton>
        <ToggleGroupButton label="" value="value-2">
          Value 2
        </ToggleGroupButton>
      </ToggleGroup>,
    );

    await userEvent.click(screen.getByText('Value 2'));

    // Should not call onValueChange
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
