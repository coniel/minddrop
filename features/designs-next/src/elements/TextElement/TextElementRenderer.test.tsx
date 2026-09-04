import { afterEach, describe, expect, it } from 'vitest';
import { bodyDesignElement } from '@minddrop/designs-next/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { cleanup } from '../../test-utils';
import { TextElement } from './TextElement.types';
import { TextElementConfig } from './TextElementConfig';
import { TextElementRenderer } from './TextElementRenderer';

// A text element with static text content
const textElement: TextElement = {
  ...bodyDesignElement,
  type: TextElementConfig.type,
  text: 'A longer piece of body text.',
};

describe('TextElementRenderer', () => {
  afterEach(cleanup);

  it('renders the element text', () => {
    render(<TextElementRenderer element={textElement} />);

    expect(
      screen.getByText('A longer piece of body text.'),
    ).toBeInTheDocument();
  });
});
