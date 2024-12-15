import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import {
  KeyboardAccessibleClickHandler,
  createKeydownClickHandler,
} from './createKeydownClickHandler';

interface TestProps {
  onClick: KeyboardAccessibleClickHandler;
  onKeyDown?: () => void;
}

const Test: React.FC<TestProps> = ({ onClick, onKeyDown }) => (
  <button
    type="button"
    onKeyDown={createKeydownClickHandler(onClick, onKeyDown)}
  >
    test
  </button>
);

describe('createKeydownClickHandler', () => {
  afterEach(cleanup);

  it('handles Enter key', () => {
    const onClick = vi.fn();
    render(<Test onClick={onClick} />);

    act(() => {
      fireEvent.keyDown(screen.getByRole('button'), {
        key: 'Enter',
      });
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('handles space key', () => {
    const onClick = vi.fn();
    render(<Test onClick={onClick} />);

    act(() => {
      fireEvent.keyDown(screen.getByRole('button'), {
        key: ' ',
      });
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onKeyDown', () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(<Test onClick={onClick} onKeyDown={onKeyDown} />);

    act(() => {
      fireEvent.keyDown(screen.getByRole('button'), {
        key: ' ',
      });
    });

    expect(onKeyDown).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalled();
  });
});
