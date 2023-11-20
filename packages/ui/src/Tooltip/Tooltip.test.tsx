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

  it('translates string title', async () => {
    const { getAllByTranslatedText } = render(
      <Tooltip open title="test">
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    getAllByTranslatedText('test');
  });

  it('renders non-string title as is', async () => {
    const { getAllByText } = render(
      <Tooltip open title={<span>test</span>}>
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    getAllByText('test');
  });

  it('translates string description', async () => {
    const { getAllByTranslatedText } = render(
      <Tooltip open title={<span />} description="test">
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    getAllByTranslatedText('test');
  });

  it('renders non-string description as is', async () => {
    const { getAllByText } = render(
      <Tooltip open title={<span />} description={<span>test</span>}>
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    getAllByText('test');
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

  it('renders the keyboard shortcut', async () => {
    render(
      <Tooltip open title="Tooltip title" keyboardShortcut={['Shift']}>
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    screen.getAllByText('Shift');
  });
});
