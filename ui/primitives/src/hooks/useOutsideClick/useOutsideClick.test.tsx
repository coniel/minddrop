import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { ActionMenuItem } from '../../ActionMenuItem';
import { DropdownMenuContent } from '../../DropdownMenu/DropdownMenuContent';
import { DropdownMenuPortal } from '../../DropdownMenu/DropdownMenuPortal';
import { DropdownMenuPositioner } from '../../DropdownMenu/DropdownMenuPositioner';
import { DropdownMenuRoot } from '../../DropdownMenu/DropdownMenuRoot';
import { DropdownMenuTrigger } from '../../DropdownMenu/DropdownMenuTrigger';
import { useOutsideClick } from './useOutsideClick';

// The number of outside clicks reported
let outsideClicks: number;

describe('useOutsideClick', () => {
  beforeEach(() => {
    outsideClicks = 0;
  });

  afterEach(cleanup);

  it('reports clicks landing outside the element', () => {
    render(<Harness />);

    fireEvent.click(screen.getByText('Outside'));

    expect(outsideClicks).toBe(1);
  });

  it('ignores clicks landing inside the element', () => {
    render(<Harness />);

    fireEvent.click(screen.getByText('Inside'));

    expect(outsideClicks).toBe(0);
  });

  it('ignores clicks landing in a popup portal', () => {
    render(<Harness />);

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Item'));

    expect(outsideClicks).toBe(0);
  });

  it('watches nothing while disabled', () => {
    render(<Harness enabled={false} />);

    fireEvent.click(screen.getByText('Outside'));

    expect(outsideClicks).toBe(0);
  });
});

interface HarnessProps {
  /**
   * Whether the hook is watching for clicks.
   */
  enabled?: boolean;
}

/**
 * Renders a watched element holding a menu trigger, beside an
 * unwatched sibling.
 */
const Harness: React.FC<HarnessProps> = ({ enabled = true }) => {
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(
    ref,
    () => {
      outsideClicks += 1;
    },
    enabled,
  );

  return (
    <div>
      <div ref={ref}>
        <span>Inside</span>
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <button type="button">Open</button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner>
              <DropdownMenuContent>
                <ActionMenuItem stringLabel="Item" />
              </DropdownMenuContent>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>
      <span>Outside</span>
    </div>
  );
};
