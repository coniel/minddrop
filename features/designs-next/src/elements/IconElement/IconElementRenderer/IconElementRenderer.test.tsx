import { afterEach, describe, expect, it } from 'vitest';
import { iconDesignElement } from '@minddrop/designs-next/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { cleanup } from '../../../test-utils';
import { IconElement } from '../IconElement.types';
import { IconElementConfig } from '../IconElementConfig';
import { IconElementRenderer } from './IconElementRenderer';

// An icon element with no icon picked on it
const iconElement: IconElement = {
  ...iconDesignElement,
  type: IconElementConfig.type,
};

describe('IconElementRenderer', () => {
  afterEach(cleanup);

  // Which glyph is drawn is not observable here. Content icon sets
  // load asynchronously, so the icon renders as an empty frame.
  it('draws the icon it resolves', () => {
    render(
      <IconElementRenderer
        element={{ ...iconElement, content: 'lucide:star:default' }}
      />,
    );

    expect(screen.getByTestId('content-icon')).toBeInTheDocument();
  });

  it('draws nothing when it resolves no icon', () => {
    render(<IconElementRenderer element={iconElement} />);

    expect(screen.queryByTestId('content-icon')).not.toBeInTheDocument();
  });
});
