import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import { TextInput } from './TextInput';

describe('<TextInput />', () => {
  afterEach(cleanup);

  describe('onCommit', () => {
    it('commits the value on Enter', () => {
      const committed: string[] = [];

      render(
        <TextInput
          defaultValue="A name"
          onCommit={(value) => committed.push(value)}
        />,
      );

      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

      expect(committed).toEqual(['A name']);
    });

    it('commits the value as it was typed', () => {
      const committed: string[] = [];

      render(<TextInput onCommit={(value) => committed.push(value)} />);

      const field = screen.getByRole('textbox');

      fireEvent.change(field, { target: { value: 'A new name' } });
      fireEvent.keyDown(field, { key: 'Enter' });

      expect(committed).toEqual(['A new name']);
    });

    it('leaves other keys alone', () => {
      const committed: string[] = [];

      render(
        <TextInput
          defaultValue="A name"
          onCommit={(value) => committed.push(value)}
        />,
      );

      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });

      expect(committed).toEqual([]);
    });

    it('takes the committing key away from what the focus lands on', () => {
      render(<TextInput defaultValue="A name" onCommit={() => undefined} />);

      const field = screen.getByRole('textbox');

      // Committing tends to close what the field is in, and the key's
      // default activation would press whatever is focused by then.
      const event = createEvent.keyDown(field, { key: 'Enter' });

      fireEvent(field, event);

      expect(event.defaultPrevented).toBe(true);
    });

    it('leaves the key alone for a field which does not commit', () => {
      render(<TextInput defaultValue="A name" />);

      const field = screen.getByRole('textbox');

      const event = createEvent.keyDown(field, { key: 'Enter' });

      fireEvent(field, event);

      expect(event.defaultPrevented).toBe(false);
    });

    it('still calls the key down handler it was given', () => {
      const keys: string[] = [];

      render(
        <TextInput
          defaultValue="A name"
          onKeyDown={(event) => keys.push(event.key)}
          onCommit={() => undefined}
        />,
      );

      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

      expect(keys).toEqual(['Enter']);
    });
  });
});
