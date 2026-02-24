import { afterEach, beforeAll, describe, it } from 'vitest';
import {
  cleanup,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { Tooltip, TooltipProvider } from './Tooltip';

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

describe('<Tooltip />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-expect-error Sufficient for test
    window.DOMRect = { fromRect: () => ({}) };
    window.ResizeObserver = ResizeObserver;
  });

  it('translates string title', async () => {
    const { getAllByTranslatedText } = render(
      <TooltipProvider>
        <Tooltip open title="test">
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    getAllByTranslatedText('test');
  });

  it('renders non-string title as is', async () => {
    render(
      <TooltipProvider>
        <Tooltip open title={<span>custom-title-content</span>}>
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    screen.getAllByText('custom-title-content');
  });

  it('translates string description', async () => {
    const { getAllByTranslatedText } = render(
      <TooltipProvider>
        <Tooltip open title={<span />} description="test">
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    getAllByTranslatedText('test');
  });

  it('renders non-string description as is', async () => {
    render(
      <TooltipProvider>
        <Tooltip
          open
          title={<span />}
          description={<span>custom-desc-content</span>}
        >
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    screen.getAllByText('custom-desc-content');
  });

  it('opens on hover', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Tooltip title="Tooltip title">
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => screen.getAllByText('Tooltip title'));
  });

  it('renders the keyboard shortcut', async () => {
    render(
      <TooltipProvider>
        <Tooltip open title="Tooltip title" keyboardShortcut={['Shift']}>
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    screen.getAllByText('Shift');
  });
});
