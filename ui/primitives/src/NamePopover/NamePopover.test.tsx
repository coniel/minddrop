import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
} from '@minddrop/test-utils';
import { NamePopover } from './NamePopover';

describe('<NamePopover />', () => {
  afterEach(cleanup);

  function init(props: Partial<React.ComponentProps<typeof NamePopover>> = {}) {
    const committed: string[] = [];
    const openStates: boolean[] = [];

    render(
      <NamePopover
        open
        defaultValue="A name"
        onOpenChange={(open) => openStates.push(open)}
        onSubmit={(name) => committed.push(name)}
        {...props}
      />,
    );

    return { committed, openStates };
  }

  it('opens the field with the name it was given', () => {
    init();

    expect(screen.getByRole('textbox')).toHaveValue('A name');
  });

  it('commits the name on Enter', () => {
    const { committed, openStates } = init();

    const field = screen.getByRole('textbox');

    fireEvent.change(field, { target: { value: 'A new name' } });
    fireEvent.keyDown(field, { key: 'Enter' });

    expect(committed).toEqual(['A new name']);
    expect(openStates).toEqual([false]);
  });

  it('commits the name from the check button', async () => {
    const { committed, openStates } = init();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'A new name' },
    });

    await userEvent.click(screen.getByLabelText('actions.save'));

    expect(committed).toEqual(['A new name']);
    expect(openStates).toEqual([false]);
  });

  it('commits the name without the spaces around it', () => {
    const { committed } = init();

    const field = screen.getByRole('textbox');

    fireEvent.change(field, { target: { value: '  A new name  ' } });
    fireEvent.keyDown(field, { key: 'Enter' });

    expect(committed).toEqual(['A new name']);
  });

  it('commits nothing for a blank name', () => {
    const { committed, openStates } = init();

    const field = screen.getByRole('textbox');

    fireEvent.change(field, { target: { value: '   ' } });
    fireEvent.keyDown(field, { key: 'Enter' });

    expect(committed).toEqual([]);
    expect(openStates).toEqual([]);
  });

  it('names alone when given neither an icon nor a colour', () => {
    init();

    expect(screen.queryByLabelText('actions.pickIcon')).toBeNull();
    expect(screen.queryByLabelText('actions.pickColor')).toBeNull();
  });

  it('picks an icon when given one', () => {
    init({ icon: 'lucide:tag:default', onIconChange: () => undefined });

    expect(screen.getByLabelText('actions.pickIcon')).toBeInTheDocument();
  });

  it('picks a colour when given one', () => {
    init({ color: 'red', onColorChange: () => undefined });

    expect(screen.getByLabelText('actions.pickColor')).toBeInTheDocument();
  });

  it('shows the error it is given', () => {
    init({ error: 'formErrors.required' });

    expect(screen.getByText('formErrors.required')).toBeInTheDocument();
  });
  describe('commitOnClose', () => {
    it('commits the name when the popover is dismissed', async () => {
      const { committed, openStates } = init({ commitOnClose: true });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'A new name' },
      });

      await dismiss();

      expect(committed).toEqual(['A new name']);
      expect(openStates).toEqual([false]);
    });

    it('commits nothing when a popover which does not is dismissed', async () => {
      const { committed, openStates } = init();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'A new name' },
      });

      await dismiss();

      expect(committed).toEqual([]);
      expect(openStates).toEqual([false]);
    });

    it('cancels the name on Escape', async () => {
      const { committed, openStates } = init({ commitOnClose: true });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'A new name' },
      });

      await userEvent.keyboard('{Escape}');

      expect(committed).toEqual([]);
      expect(openStates).toEqual([false]);
    });

    it('hands the name over once when the check button commits it', async () => {
      const { committed, openStates } = init({ commitOnClose: true });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'A new name' },
      });

      // The button commits and closes in one gesture, which is one
      // naming rather than two.
      await userEvent.click(screen.getByLabelText('actions.save'));

      expect(committed).toEqual(['A new name']);
      expect(openStates).toEqual([false]);
    });

    it('commits nothing for a blank name', async () => {
      const { committed } = init({ commitOnClose: true });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '   ' },
      });

      await dismiss();

      expect(committed).toEqual([]);
    });
  });
});

/**
 * Dismisses the popover the way a press outside it does.
 */
async function dismiss(): Promise<void> {
  await userEvent.click(document.body);
}
