/* eslint-disable class-methods-use-this */
import React from 'react';
import {
  render,
  act,
  fireEvent,
  waitFor,
  cleanup,
  screen,
} from '@minddrop/test-utils';
import { Tooltip } from './Tooltip';

class ResizeObserver {
  observe() {}

  unobserve() {}
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
    render(
      <Tooltip title="Tooltip title">
        <button type="button">tooltip</button>
      </Tooltip>,
    );

    act(() => {
      fireEvent.mouseOver(screen.getByRole('button'));
    });

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
