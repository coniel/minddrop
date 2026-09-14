import { useState } from 'react';
import { afterEach, describe, it } from 'vitest';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import {
  MenuItemHoverContext,
  useMenuItemHoverState,
  useNotifyMenuItemHover,
  useOnMenuItemHover,
} from './MenuItemHoverContext';

// Provides the hover context the way a menu panel does
const Menu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const itemHover = useMenuItemHoverState();

  return (
    <MenuItemHoverContext.Provider value={itemHover}>
      {children}
    </MenuItemHoverContext.Provider>
  );
};

// Reports its hovers to the surrounding menu
const Item: React.FC = () => {
  const notify = useNotifyMenuItemHover();

  return (
    <button type="button" onMouseMove={notify}>
      item
    </button>
  );
};

// Renders the number of item hovers it was told about
const Listener: React.FC = () => {
  const [hovers, setHovers] = useState(0);

  useOnMenuItemHover(() => setHovers((count) => count + 1));

  return <span>{hovers}</span>;
};

describe('MenuItemHoverContext', () => {
  afterEach(cleanup);

  it('reports item hovers to the menu', async () => {
    render(
      <Menu>
        <Item />
        <Listener />
      </Menu>,
    );

    await userEvent.hover(screen.getByRole('button'));

    screen.getByText('1');
  });

  it('does not reach the listeners of another menu', async () => {
    render(
      <>
        <Menu>
          <Item />
        </Menu>
        <Menu>
          <Listener />
        </Menu>
      </>,
    );

    await userEvent.hover(screen.getByRole('button'));

    screen.getByText('0');
  });

  it('does nothing outside a menu', async () => {
    render(
      <>
        <Item />
        <Listener />
      </>,
    );

    await userEvent.hover(screen.getByRole('button'));

    screen.getByText('0');
  });
});
