import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { FloatingToolbar } from '../FloatingToolbar';
import { IconButton } from '../IconButton';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../Popover';
import { Select } from '../Select';
import { ToolbarHoverPanel } from './ToolbarHoverPanel';

// The attribute the panel marks its host toolbar with
const SquaredCornersAttribute = 'data-hover-menu-squared';

// Long enough for the hover menu's close delay to elapse
const PastCloseDelay = 200;

/**
 * Renders the panel in a toolbar and opens it. The panel opens on
 * hover in use, which the hover menu hook has its own tests for;
 * pressing the trigger opens it synchronously. Its content holds a
 * popover of its own.
 *
 * @param leadingControl - Whether a control stands before the
 *   panel's trigger in the toolbar.
 */
function renderPanel(leadingControl = true) {
  const { container } = render(
    <FloatingToolbar visible>
      {leadingControl && <IconButton icon="pin" label="actions.done" />}
      <ToolbarHoverPanel label="Colour" trigger={<span>swatch</span>}>
        <span>panel content</span>
        <Popover>
          <PopoverTrigger>
            <button type="button">open popover</button>
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverPositioner>
              <PopoverContent>
                popover content
                <PopoverClose>close popover</PopoverClose>
              </PopoverContent>
            </PopoverPositioner>
          </PopoverPortal>
        </Popover>
      </ToolbarHoverPanel>
      <span>elsewhere</span>
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('Colour'));

  return container.querySelector('.floating-toolbar');
}

/**
 * Moves the pointer off the open panel to somewhere outside it.
 */
function leavePanel() {
  fireEvent.pointerLeave(screen.getByText('panel content'), {
    relatedTarget: screen.getByText('elsewhere'),
  });
}

/**
 * Lets the hover menu's close delay elapse.
 */
function waitForCloseDelay() {
  act(() => {
    vi.advanceTimersByTime(PastCloseDelay);
  });
}

/**
 * Opens the panel's popover, which locks the panel open.
 */
function openPopover() {
  fireEvent.click(screen.getByText('open popover'));
}

/**
 * Lays the toolbar and the panel out, since jsdom measures nothing:
 * the toolbar's end stands at the given offset below the trigger,
 * the panel is the given height, and the other controls stand at
 * the given offsets from the trigger's top, by their text.
 *
 * @param toolbarBelowTrigger - Pixels from the trigger's top to the toolbar's end.
 * @param panelHeight - The panel's pixel height.
 * @param controls - Each control's top and bottom, by its text.
 */
function layOut(
  toolbarBelowTrigger: number,
  panelHeight: number,
  controls: Record<string, [number, number]> = {},
) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function measure(this: HTMLElement) {
      const rect = { top: 0, bottom: 0 };
      const control = controls[this.textContent ?? ''];

      if (this.classList.contains('floating-toolbar')) {
        rect.bottom = toolbarBelowTrigger;
      } else if (control) {
        [rect.top, rect.bottom] = control;
      }

      return rect as DOMRect;
    },
  );
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(
    function measure(this: HTMLElement) {
      return this.classList.contains('toolbar-hover-panel') ? panelHeight : 0;
    },
  );
}

describe('ToolbarHoverPanel', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('opens the panel', () => {
    renderPanel();

    expect(screen.getByText('panel content')).toBeInTheDocument();
  });

  it('squares the toolbar corner it runs past', () => {
    const host = renderPanel();

    expect(host).toHaveAttribute(SquaredCornersAttribute, 'bottom-right');
  });

  it('squares the toolbar start as well when it reaches out of the first control', () => {
    const host = renderPanel(false);

    expect(host).toHaveAttribute(
      SquaredCornersAttribute,
      'top-right bottom-right',
    );
  });

  it('stands alongside the toolbar when its content ends first', () => {
    layOut(300, 100);

    const host = renderPanel();

    expect(host).not.toHaveAttribute(SquaredCornersAttribute);
    expect(
      screen.getByText('panel content').closest('.toolbar-hover-panel'),
    ).toHaveClass('toolbar-hover-panel-alongside');
  });

  it('reaches past the toolbar end when its content runs beyond it', () => {
    layOut(100, 300);

    const host = renderPanel();

    expect(host).toHaveAttribute(SquaredCornersAttribute, 'bottom-right');
    expect(
      screen.getByText('panel content').closest('.toolbar-hover-panel'),
    ).not.toHaveClass('toolbar-hover-panel-alongside');
  });

  it('steps back the controls it runs alongside', () => {
    // The panel covers 100px below the trigger's top: the control
    // above it and the one below its end stand clear.
    // The control above ends where the trigger starts, which the
    // panel's inset reaches into without covering it.
    layOut(300, 100, {
      Before: [-24, 0],
      After: [30, 54],
      Far: [130, 154],
    });

    render(
      <FloatingToolbar visible style={{ paddingTop: 4 }}>
        <button type="button">Before</button>
        <ToolbarHoverPanel label="Colour" trigger={<span>swatch</span>}>
          <span>panel content</span>
        </ToolbarHoverPanel>
        <button type="button">After</button>
        <button type="button">Far</button>
      </FloatingToolbar>,
    );

    fireEvent.click(screen.getByLabelText('Colour'));

    expect(screen.getByText('After')).toHaveAttribute('data-hover-menu-dimmed');
    expect(screen.getByText('Before')).not.toHaveAttribute(
      'data-hover-menu-dimmed',
    );
    expect(screen.getByText('Far')).not.toHaveAttribute(
      'data-hover-menu-dimmed',
    );
    expect(screen.getByLabelText('Colour')).not.toHaveAttribute(
      'data-hover-menu-dimmed',
    );

    // Closing the panel hands them back
    fireEvent.click(screen.getByLabelText('Colour'));

    expect(screen.getByText('After')).not.toHaveAttribute(
      'data-hover-menu-dimmed',
    );
  });

  it('leaves the toolbar rounded once closed', () => {
    const host = renderPanel();

    fireEvent.click(screen.getByLabelText('Colour'));

    expect(host).not.toHaveAttribute(SquaredCornersAttribute);
  });

  // The popup stays mounted through its exit transition, so whether
  // the panel is open is read off the toolbar it squares while open.
  it('closes once the pointer leaves it', () => {
    vi.useFakeTimers();
    const host = renderPanel();

    leavePanel();
    waitForCloseDelay();

    expect(host).not.toHaveAttribute(SquaredCornersAttribute);
  });

  it('locks open while a popover opened from it is open', () => {
    vi.useFakeTimers();
    const host = renderPanel();

    openPopover();
    leavePanel();
    waitForCloseDelay();

    expect(host).toHaveAttribute(SquaredCornersAttribute);
  });

  it('stays locked once that popover closes with the pointer away', () => {
    vi.useFakeTimers();
    const host = renderPanel();

    openPopover();
    leavePanel();
    fireEvent.click(screen.getByText('close popover'));
    waitForCloseDelay();

    expect(host).toHaveAttribute(SquaredCornersAttribute);
  });

  it('closes on the next leave once the pointer comes back', () => {
    vi.useFakeTimers();
    const host = renderPanel();

    openPopover();
    fireEvent.pointerEnter(screen.getByText('panel content'));
    leavePanel();
    waitForCloseDelay();

    expect(host).not.toHaveAttribute(SquaredCornersAttribute);
  });

  it('closes on a press outside while locked', () => {
    vi.useFakeTimers();
    const host = renderPanel();

    openPopover();
    leavePanel();
    fireEvent.pointerDown(screen.getByText('elsewhere'));
    fireEvent.click(screen.getByText('elsewhere'));
    waitForCloseDelay();

    expect(host).not.toHaveAttribute(SquaredCornersAttribute);
  });

  it('locks open while a select opened from it is open', () => {
    vi.useFakeTimers();
    const { container } = render(
      <FloatingToolbar visible>
        <ToolbarHoverPanel label="Colour" trigger={<span>swatch</span>}>
          <span>panel content</span>
          <Select
            options={[{ value: 'red', stringLabel: 'Red' }]}
            stringPlaceholder="pick"
          />
        </ToolbarHoverPanel>
        <span>elsewhere</span>
      </FloatingToolbar>,
    );

    fireEvent.click(screen.getByLabelText('Colour'));
    fireEvent.click(screen.getByRole('combobox'));
    leavePanel();
    waitForCloseDelay();

    expect(container.querySelector('.floating-toolbar')).toHaveAttribute(
      SquaredCornersAttribute,
    );
  });
});
