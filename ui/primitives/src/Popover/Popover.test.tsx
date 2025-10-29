import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { Popover } from './Popover';

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

describe('<Popover />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-expect-error Sufficient for test
    window.DOMRect = { fromRect: () => ({}) };
    window.ResizeObserver = ResizeObserver;
  });
  it('renders the className', () => {
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className="my-class">content</PopoverContent>
      </Popover>,
    );

    expect(screen.getByText('content').className).toContain('my-class');
  });
});
