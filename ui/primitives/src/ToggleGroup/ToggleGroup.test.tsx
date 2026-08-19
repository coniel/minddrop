import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { Toggle } from '../Toggle';
import { ToggleGroup } from './ToggleGroup';

describe('<ToggleGroup />', () => {
  afterEach(cleanup);

  it('presses any number of toggles at once', () => {
    render(<FormattingGroup />);

    fireEvent.click(toggle('Bold'));
    fireEvent.click(toggle('Italic'));

    // Pressing a second toggle leaves the first pressed
    expect(toggle('Bold').getAttribute('aria-pressed')).toBe('true');
    expect(toggle('Italic').getAttribute('aria-pressed')).toBe('true');
  });

  it('releases a pressed toggle when it is clicked again', () => {
    render(<FormattingGroup />);

    fireEvent.click(toggle('Bold'));
    fireEvent.click(toggle('Bold'));

    expect(toggle('Bold').getAttribute('aria-pressed')).toBe('false');
  });
});

/**
 * Returns the toggle button carrying the given label.
 */
function toggle(label: string): HTMLElement {
  return screen.getByRole('button', { name: label });
}

/**
 * Renders a controlled group of formatting toggles.
 */
const FormattingGroup: React.FC = () => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <ToggleGroup value={value} onValueChange={setValue}>
      <Toggle value="bold" label="Bold" />
      <Toggle value="italic" label="Italic" />
    </ToggleGroup>
  );
};
