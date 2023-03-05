import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { ColorSelectionMenuItem } from './ColorSelectionMenuItem';
import { i18n } from '@minddrop/i18n';

describe('<ColorSelectionMenuItem />', () => {
  afterEach(cleanup);

  it('renders the color name', () => {
    render(<ColorSelectionMenuItem color="red" />);

    const colorName = i18n.t('colorRed');
    screen.getByText(colorName);
  });

  it('renders the appropriate icon color', () => {
    render(<ColorSelectionMenuItem color="red" />);

    expect(screen.getByTestId('icon').className).toContain('color-red');
  });
});
