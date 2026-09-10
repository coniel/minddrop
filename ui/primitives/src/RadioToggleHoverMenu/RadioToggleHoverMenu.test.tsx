import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { Toolbar } from '../Toolbar';
import {
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
} from './RadioToggleHoverMenu';

// The value passed to the most recent onValueChange call
let changedValue: string | null;

// The options offered by the rendered menu
const options: RadioToggleHoverMenuOption<'left' | 'center' | 'right'>[] = [
  { value: 'left', icon: 'align-left', label: 'Align left' },
  { value: 'center', icon: 'align-center', label: 'Align center' },
  { value: 'right', icon: 'align-right', label: 'Align right' },
];

describe('RadioToggleHoverMenu', () => {
  beforeEach(() => {
    changedValue = null;
  });

  afterEach(cleanup);

  it('keeps the options behind the trigger until it is opened', () => {
    renderMenu();

    expect(screen.getByLabelText('Alignment')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByLabelText('Align left')).toBeNull();

    openMenu();

    expect(screen.getByLabelText('Align left')).toBeInTheDocument();
  });

  it('opens the options on hover', async () => {
    renderMenu();

    await userEvent.hover(screen.getByLabelText('Alignment'));

    expect(await screen.findByLabelText('Align left')).toBeInTheDocument();
  });

  it('closes once the pointer leaves the trigger and the options', async () => {
    renderMenu();

    const trigger = screen.getByLabelText('Alignment');

    await userEvent.hover(trigger);
    await screen.findByLabelText('Align left');

    await userEvent.unhover(trigger);

    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    );
  });

  it('closes after an option is chosen once the pointer leaves', async () => {
    renderMenu();

    const trigger = screen.getByLabelText('Alignment');

    await userEvent.hover(trigger);

    const option = await screen.findByLabelText('Align right');

    await userEvent.hover(option);
    await userEvent.click(option);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.unhover(option);

    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    );
  });

  it('presses the selected option only', () => {
    renderMenu();
    openMenu();

    expect(screen.getByLabelText('Align center')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Align left')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('fires onValueChange with the chosen value', () => {
    renderMenu();
    openMenu();

    fireEvent.click(screen.getByLabelText('Align right'));

    expect(changedValue).toBe('right');
  });

  it('stays open when an option is chosen', () => {
    renderMenu();
    openMenu();

    fireEvent.click(screen.getByLabelText('Align right'));

    expect(screen.getByLabelText('Alignment')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('holds the trigger active while the menu is open', () => {
    renderMenu();

    expect(screen.getByLabelText('Alignment')).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    openMenu();

    expect(screen.getByLabelText('Alignment')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('runs the options flush with the toolbar end it sits at', () => {
    const { container } = render(
      <Toolbar>
        <button type="button">Before</button>
        <RadioToggleHoverMenu
          options={options}
          value="center"
          label="Alignment"
          onValueChange={() => undefined}
        />
      </Toolbar>,
    );

    openMenu();

    // Last of the toolbar's controls, so flush with its end only
    expect(container.querySelector('.toolbar')).toHaveAttribute(
      'data-hover-menu-squared',
      'bottom-right',
    );
    expect(
      document.querySelector('.radio-toggle-hover-menu-options'),
    ).toHaveClass('radio-toggle-hover-menu-options-flush-end');
    expect(
      document.querySelector('.radio-toggle-hover-menu-options'),
    ).not.toHaveClass('radio-toggle-hover-menu-options-flush-start');
  });

  it('squares the corners on the side it opens towards', () => {
    const { container } = render(
      <Toolbar>
        <RadioToggleHoverMenu
          side="left"
          options={options}
          value="center"
          label="Alignment"
          onValueChange={() => undefined}
        />
      </Toolbar>,
    );

    openMenu();

    expect(container.querySelector('.toolbar')).toHaveAttribute(
      'data-hover-menu-squared',
      'top-left bottom-left',
    );
    expect(
      document.querySelector('.radio-toggle-hover-menu-options'),
    ).toHaveClass('radio-toggle-hover-menu-options-side-left');
  });

  it('leaves a toolbar whose ends it does not reach alone', () => {
    const { container } = render(
      <Toolbar>
        <button type="button">Before</button>
        <RadioToggleHoverMenu
          options={options}
          value="center"
          label="Alignment"
          onValueChange={() => undefined}
        />
        <button type="button">After</button>
      </Toolbar>,
    );

    openMenu();

    expect(container.querySelector('.toolbar')).not.toHaveAttribute(
      'data-hover-menu-squared',
    );
    expect(
      document.querySelector('.radio-toggle-hover-menu-options')?.className,
    ).not.toContain('flush');
  });

  it('lays the options out in the columns it is given', () => {
    render(
      <RadioToggleHoverMenu
        columns={2}
        options={options}
        value="center"
        label="Alignment"
        onValueChange={() => undefined}
      />,
    );

    openMenu();

    expect(document.querySelector('.radio-toggle-group')).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: 'repeat(2, auto)',
    });
  });

  it('runs the options along a row without columns', () => {
    renderMenu();
    openMenu();

    expect(document.querySelector('.radio-toggle-group')).not.toHaveStyle({
      display: 'grid',
    });
  });

  it('runs flush with the end its rows reach past the trigger', () => {
    const { container } = render(
      <Toolbar>
        <button type="button">Before</button>
        <RadioToggleHoverMenu
          columns={2}
          options={options}
          value="center"
          label="Alignment"
          onValueChange={() => undefined}
        />
        <button type="button">After</button>
      </Toolbar>,
    );

    openMenu();

    // Second to last of the toolbar's controls, so the menu's
    // second row runs alongside the last one, down to its end.
    expect(container.querySelector('.toolbar')).toHaveAttribute(
      'data-hover-menu-squared',
      'bottom-right',
    );
    expect(
      document.querySelector('.radio-toggle-hover-menu-options'),
    ).toHaveClass('radio-toggle-hover-menu-options-flush-end');
    expect(
      document.querySelector('.radio-toggle-hover-menu-options'),
    ).not.toHaveClass('radio-toggle-hover-menu-options-flush-start');
  });

  it("rises above the trigger at the toolbar's end", () => {
    const { container } = render(
      <Toolbar>
        <button type="button">Before</button>
        <RadioToggleHoverMenu
          columns={2}
          options={options}
          value="center"
          label="Alignment"
          onValueChange={() => undefined}
        />
      </Toolbar>,
    );

    openMenu();

    // Last of the toolbar's controls, so the rows rise from it:
    // the trigger takes the bottom row and the first runs alongside
    // the control above, reaching both of the toolbar's ends.
    expect(container.querySelector('.toolbar')).toHaveAttribute(
      'data-hover-menu-squared',
      'top-right bottom-right',
    );
  });

  it('steps back the controls its rows run alongside', () => {
    render(
      <Toolbar>
        <button type="button">Before</button>
        <RadioToggleHoverMenu
          columns={2}
          options={options}
          value="center"
          label="Alignment"
          onValueChange={() => undefined}
        />
        <button type="button">After</button>
      </Toolbar>,
    );

    openMenu();

    // The second row runs alongside the control below the trigger
    expect(screen.getByText('After')).toHaveAttribute('data-hover-menu-dimmed');

    // The trigger keeps its weight, as does the control the rows
    // never reach.
    expect(screen.getByLabelText('Alignment')).not.toHaveAttribute(
      'data-hover-menu-dimmed',
    );
    expect(screen.getByText('Before')).not.toHaveAttribute(
      'data-hover-menu-dimmed',
    );

    // Closing the menu hands them back
    openMenu();

    expect(screen.getByText('After')).not.toHaveAttribute(
      'data-hover-menu-dimmed',
    );
  });

  it('releases the toolbar end when it closes', () => {
    const { container } = render(
      <Toolbar>
        <RadioToggleHoverMenu
          options={options}
          value="center"
          label="Alignment"
          onValueChange={() => undefined}
        />
      </Toolbar>,
    );

    openMenu();

    // The toolbar's only control, so flush with both its ends
    expect(container.querySelector('.toolbar')).toHaveAttribute(
      'data-hover-menu-squared',
      'top-right bottom-right',
    );

    // Pressing the trigger again closes it
    openMenu();

    expect(container.querySelector('.toolbar')).not.toHaveAttribute(
      'data-hover-menu-squared',
    );
  });
});

/**
 * Renders the menu on the alignment options with a recording
 * change callback.
 */
function renderMenu() {
  render(
    <RadioToggleHoverMenu
      options={options}
      value="center"
      label="Alignment"
      onValueChange={(value) => {
        changedValue = value;
      }}
    />,
  );
}

/**
 * Opens the menu by pressing its trigger, which the tests about
 * what the open menu does use for being synchronous. Opening on
 * hover has tests of its own.
 */
function openMenu() {
  fireEvent.click(screen.getByLabelText('Alignment'));
}
