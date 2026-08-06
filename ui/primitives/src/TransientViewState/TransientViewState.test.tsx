import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@minddrop/test-utils';
import {
  TransientViewStateContextValue,
  TransientViewStateProvider,
} from './TransientViewStateContext';
import {
  TransientViewStateScope,
  useTransientViewStateKey,
} from './TransientViewStateScope';
import { useTransientState } from './useTransientState';

describe('TransientViewState', () => {
  afterEach(cleanup);

  describe('useTransientViewStateKey', () => {
    it('composes nested scope segments into the full key', () => {
      const { getByTestId } = render(
        <TransientViewStateScope segment="layout-1">
          <TransientViewStateScope segment="entry-1">
            <KeyProbe localKey="content" />
          </TransientViewStateScope>
        </TransientViewStateScope>,
      );

      expect(getByTestId('key').textContent).toBe('layout-1:entry-1:content');
    });

    it('returns the bare key when there is no scope', () => {
      const { getByTestId } = render(<KeyProbe localKey="content" />);

      expect(getByTestId('key').textContent).toBe('content');
    });
  });

  describe('useTransientState', () => {
    it('initializes from the stored value', () => {
      const { value } = createBag({ 'layout-1:selected': 'stored' });

      const { getByRole } = render(
        <TransientViewStateProvider value={value}>
          <TransientViewStateScope segment="layout-1">
            <SelectionProbe />
          </TransientViewStateScope>
        </TransientViewStateProvider>,
      );

      expect(getByRole('button').textContent).toBe('stored');
    });

    it('writes updates through to the backend', () => {
      const { bag, value } = createBag();

      const { getByRole } = render(
        <TransientViewStateProvider value={value}>
          <TransientViewStateScope segment="layout-1">
            <SelectionProbe />
          </TransientViewStateScope>
        </TransientViewStateProvider>,
      );

      fireEvent.click(getByRole('button'));

      expect(getByRole('button').textContent).toBe('updated');
      expect(bag['layout-1:selected']).toBe('updated');
    });

    it('falls back to local state without a provider', () => {
      const { getByRole } = render(<SelectionProbe />);

      fireEvent.click(getByRole('button'));

      expect(getByRole('button').textContent).toBe('updated');
    });

    it('stays local when the key is undefined', () => {
      const { bag, value } = createBag();

      const { getByRole } = render(
        <TransientViewStateProvider value={value}>
          <UnkeyedSelectionProbe />
        </TransientViewStateProvider>,
      );

      fireEvent.click(getByRole('button'));

      expect(getByRole('button').textContent).toBe('updated');
      expect(bag).toEqual({});
    });
  });
});

/*
 * Creates an in-memory state bag and a context value backed
 * by it.
 */
function createBag(initial: Record<string, unknown> = {}) {
  const bag: Record<string, unknown> = { ...initial };

  const value: TransientViewStateContextValue = {
    get: (key) => bag[key],
    set: (key, storedValue) => {
      bag[key] = storedValue;
    },
  };

  return { bag, value };
}

/*
 * Renders its full state key for assertions.
 */
const KeyProbe: React.FC<{ localKey: string }> = ({ localKey }) => (
  <div data-testid="key">{useTransientViewStateKey(localKey)}</div>
);

/*
 * Renders a transient selection value and updates it on click.
 */
const SelectionProbe: React.FC = () => {
  const [selected, setSelected] = useTransientState('selected', 'default');

  return (
    <button type="button" onClick={() => setSelected('updated')}>
      {selected}
    </button>
  );
};

/*
 * Renders a transient selection value without opting into
 * persistence.
 */
const UnkeyedSelectionProbe: React.FC = () => {
  const [selected, setSelected] = useTransientState(undefined, 'default');

  return (
    <button type="button" onClick={() => setSelected('updated')}>
      {selected}
    </button>
  );
};
