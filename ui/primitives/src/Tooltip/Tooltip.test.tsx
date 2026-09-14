import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  cleanup,
  fireEvent,
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
        <Tooltip stringTitle="Tooltip title">
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => screen.getAllByText('Tooltip title'));
  });

  it('adopts the id of a child that carries its own', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Tooltip stringTitle="Tooltip title">
          <button type="button" id="menu-trigger">
            tooltip
          </button>
        </Tooltip>
      </TooltipProvider>,
    );

    const button = screen.getByRole('button');

    await user.hover(button);

    await waitFor(() => screen.getAllByText('Tooltip title'));

    // The trigger only reports the open state when its id matches the
    // element that opened the tooltip, which the delay group relies on.
    expect(button.id).toBe('menu-trigger');
    expect(button.hasAttribute('data-popup-open')).toBe(true);
  });

  it('dismisses on drag start', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Tooltip stringTitle="Tooltip title">
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => screen.getAllByText('Tooltip title'));

    // A drag suspends pointer events, so the tooltip never hears the
    // pointer leave and would hang over the page until the drop.
    fireEvent.dragStart(document);

    await waitFor(() => expect(screen.queryByText('Tooltip title')).toBeNull());
  });

  it('dismisses on scroll', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <div data-testid="scroll-container">
          <Tooltip stringTitle="Tooltip title">
            <button type="button">tooltip</button>
          </Tooltip>
        </div>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => screen.getAllByText('Tooltip title'));

    // Scrolling moves the trigger away without a pointer leave, so the
    // tooltip would otherwise drift along with the scrolled content.
    fireEvent.scroll(screen.getByTestId('scroll-container'));

    await waitFor(() => expect(screen.queryByText('Tooltip title')).toBeNull());
  });

  it('dismisses on a press', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Tooltip stringTitle="Tooltip title">
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => screen.getAllByText('Tooltip title'));

    // A menu opened by the press suspends pointer events over the
    // trigger, so the tooltip never hears the pointer leave and
    // reappears when the menu closes.
    fireEvent.pointerDown(document);

    await waitFor(() => expect(screen.queryByText('Tooltip title')).toBeNull());
  });

  it('stays closed when focus is handed back to the trigger', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Tooltip stringTitle="Tooltip title">
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    // A popup closing focuses the trigger which opened it, with the
    // pointer long gone from it.
    screen.getByRole('button').focus();

    await user.hover(document.body);

    expect(screen.queryByText('Tooltip title')).toBeNull();
  });

  it('stays closed when focus is handed back after a key press', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Tooltip stringTitle="Tooltip title">
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    // A popup's field committed with Enter closes it, handing the
    // focus back to the control it was opened from.
    pressKey('Enter');

    screen.getByRole('button').focus();

    await user.hover(document.body);

    expect(screen.queryByText('Tooltip title')).toBeNull();
  });

  it('opens when focus is moved onto the trigger by a tab', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Tooltip stringTitle="Tooltip title">
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    pressKey('Tab');

    screen.getByRole('button').focus();

    await user.hover(document.body);

    await waitFor(() => screen.getAllByText('Tooltip title'));
  });

  it('renders the keyboard shortcut', async () => {
    render(
      <TooltipProvider>
        <Tooltip open stringTitle="Tooltip title" keyboardShortcut={['Shift']}>
          <button type="button">tooltip</button>
        </Tooltip>
      </TooltipProvider>,
    );

    screen.getAllByText('Shift');
  });
});

/**
 * Presses a key as the person would, which the input tracking only
 * follows when the event is the browser's own.
 *
 * @param key - The key pressed.
 */
function pressKey(key: string): void {
  const event = new KeyboardEvent('keydown', { key, bubbles: true });

  Object.defineProperty(event, 'isTrusted', { value: true });

  document.dispatchEvent(event);
}
