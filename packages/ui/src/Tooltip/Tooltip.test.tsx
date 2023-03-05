import { describe, beforeAll, afterEach, it } from 'vitest';
import {
  render,
  waitFor,
  cleanup,
  screen,
  userEvent,
} from '@minddrop/test-utils';
import { Tooltip } from './Tooltip';

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

describe('<Tooltip />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-ignore
    window.DOMRect = { fromRect: () => ({}) };
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
  });

  it('renders the title', async () => {
    render(
      <Tooltip open title="Tooltip title">
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    screen.getAllByText('Tooltip title');
  });

  it('opens on hover', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip title="Tooltip title">
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button'));

    await waitFor(() => screen.getAllByText('Tooltip title'));
  });

  it('renders the description', async () => {
    render(
      <Tooltip open title="Tooltip title" description="Tooltip description">
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    screen.getAllByText('Tooltip description');
  });

  it('renders the keyboard shortcut', async () => {
    render(
      <Tooltip open title="Tooltip title" keyboardShortcut={['Shift']}>
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    screen.getAllByText('Shift');
  });
});
