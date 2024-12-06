import { describe, beforeAll, afterEach, it, expect } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Popover } from './Popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

describe('<Popover />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-ignore
    window.DOMRect = { fromRect: () => ({}) };
    // @ts-ignore
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
