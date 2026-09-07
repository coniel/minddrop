import { afterEach, describe, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
} from '../../DropdownMenu';
import { MenuRenameItem } from '../MenuRenameItem';
import {
  MenuFocusContext,
  useKeepMenuFocus,
  useMenuFocusState,
  useMenuKeepsFocus,
} from './MenuFocusContext';

// Provides the focus context the way a menu root does
const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useMenuFocusState();

  return (
    <MenuFocusContext.Provider value={state}>
      {children}
    </MenuFocusContext.Provider>
  );
};

// An item keeping the focus
const Keeper: React.FC = () => {
  useKeepMenuFocus();

  return null;
};

// Renders whether the menu keeps its focus
const Probe: React.FC = () => <span>{String(useMenuKeepsFocus())}</span>;

describe('MenuFocusContext', () => {
  afterEach(cleanup);

  it('does not keep the focus without a keeper', () => {
    render(
      <Root>
        <Probe />
      </Root>,
    );

    screen.getByText('false');
  });

  it('keeps the focus while a keeper is mounted', () => {
    const { rerender } = render(
      <Root>
        <Keeper />
        <Probe />
      </Root>,
    );

    screen.getByText('true');

    rerender(
      <Root>
        <Probe />
      </Root>,
    );

    screen.getByText('false');
  });

  it('does not keep the focus outside a menu', () => {
    render(<Probe />);

    screen.getByText('false');
  });

  it('keeps the focus of a menu containing a rename item', () => {
    render(
      <DropdownMenuRoot open>
        <DropdownMenuPortal>
          <DropdownMenuPositioner>
            <DropdownMenuContent>
              <MenuRenameItem
                value=""
                onValueChange={() => {}}
                onRename={() => {}}
              />
              <Probe />
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>,
    );

    screen.getByText('true');
  });
});
