import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { ColorSelectionMenuItem } from './ColorSelectionMenuItem';

describe('<ColorSelectionMenuItem />', () => {
  afterEach(cleanup);

  it('renders the color name', () => {
    const { getByTranslatedText } = render(
      <ColorSelectionMenuItem color="red" />,
    );

    getByTranslatedText('color.red');
  });

  it('renders the appropriate icon color', () => {
    const { getByTestId } = render(<ColorSelectionMenuItem color="red" />);

    expect(getByTestId('icon').className).toContain('color-red');
  });
});
