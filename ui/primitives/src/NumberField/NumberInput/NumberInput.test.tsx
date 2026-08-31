import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
} from '@minddrop/test-utils';
import { NumberInput } from './NumberInput';

describe('<NumberInput />', () => {
  afterEach(cleanup);

  it('renders the default value', () => {
    render(<NumberInput defaultValue={5} />);

    expect(input()).toHaveValue('5');
  });

  it('commits typed values', async () => {
    const user = userEvent.setup();

    render(<ControlledInput />);

    // Type a value and commit it by blurring
    await user.click(input());
    await user.keyboard('42');
    fireEvent.blur(input());

    expect(input()).toHaveValue('42');
    expect(value()).toHaveTextContent('42');
  });

  it('steps up from the increment button', async () => {
    const user = userEvent.setup();

    render(<ControlledInput defaultValue={5} />);

    await user.click(incrementButton());

    expect(value()).toHaveTextContent('6');
  });

  it('steps down from the decrement button', async () => {
    const user = userEvent.setup();

    render(<ControlledInput defaultValue={5} />);

    await user.click(decrementButton());

    expect(value()).toHaveTextContent('4');
  });

  it('steps by the configured step', async () => {
    const user = userEvent.setup();

    render(<ControlledInput defaultValue={10} step={5} />);

    await user.click(incrementButton());

    expect(value()).toHaveTextContent('15');
  });

  it('clamps stepping to the maximum', async () => {
    const user = userEvent.setup();

    render(<ControlledInput defaultValue={9} max={9} />);

    await user.click(incrementButton());

    expect(value()).toHaveTextContent('9');
  });

  it('clamps stepping to the minimum', async () => {
    const user = userEvent.setup();

    render(<ControlledInput defaultValue={1} min={1} clearable={false} />);

    await user.click(decrementButton());

    expect(value()).toHaveTextContent('1');
  });

  it('caps typed decimals at the configured precision', async () => {
    const user = userEvent.setup();

    render(<ControlledInput decimals={2} />);

    // Commit a value more precise than the allowed decimals
    await user.click(input());
    await user.keyboard('1.239');
    fireEvent.blur(input());

    expect(input()).toHaveValue('1.24');
  });

  it('seeds an empty clearable input from the increment button', async () => {
    const user = userEvent.setup();

    render(<ControlledInput clearable min={3} />);

    // Incrementing an empty value starts from the minimum
    await user.click(incrementButton());

    expect(value()).toHaveTextContent('3');
  });

  it('disables the decrement button while a clearable input is empty', () => {
    render(<ControlledInput clearable />);

    expect(decrementButton()).toBeDisabled();
  });

  it('clears a clearable input when decrementing at the minimum', async () => {
    const user = userEvent.setup();

    render(<ControlledInput clearable min={3} defaultValue={3} />);

    // Decrementing at the minimum empties the value
    await user.click(decrementButton());

    expect(value()).toHaveTextContent('empty');
    expect(input()).toHaveValue('');
  });

  it('prevents interaction when disabled', async () => {
    const user = userEvent.setup();

    render(<ControlledInput defaultValue={5} disabled />);

    await user.click(incrementButton());

    expect(value()).toHaveTextContent('5');
    expect(input()).toBeDisabled();
  });

  it('renders the translated placeholder', () => {
    const { getByTranslatedPlaceholderText } = render(
      <NumberInput placeholder="test" />,
    );

    getByTranslatedPlaceholderText('test');
  });
});

/**
 * Returns the number input element.
 */
function input(): HTMLElement {
  return screen.getByRole('textbox');
}

/**
 * Returns the value shown by the controlled harness.
 */
function value(): HTMLElement {
  return screen.getByTestId('value');
}

/**
 * Returns the increment stepper button.
 */
function incrementButton(): HTMLElement {
  return document.querySelector('.number-input-increment') as HTMLElement;
}

/**
 * Returns the decrement stepper button.
 */
function decrementButton(): HTMLElement {
  return document.querySelector('.number-input-decrement') as HTMLElement;
}

interface ControlledInputProps {
  defaultValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  clearable?: boolean;
  disabled?: boolean;
}

/**
 * Renders a controlled number input exposing its value as text.
 */
const ControlledInput: React.FC<ControlledInputProps> = ({
  defaultValue = null,
  min,
  max,
  step,
  decimals,
  clearable,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState<number | null>(defaultValue);

  return (
    <>
      <NumberInput
        value={inputValue}
        onValueChange={setInputValue}
        min={min}
        max={max}
        step={step}
        decimals={decimals}
        clearable={clearable}
        disabled={disabled}
      />
      <output data-testid="value">{inputValue ?? 'empty'}</output>
    </>
  );
};
