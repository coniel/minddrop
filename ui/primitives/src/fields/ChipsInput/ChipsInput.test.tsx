import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { ChipsInput, ChipsInputProps } from './ChipsInput';

interface HarnessProps
  extends Partial<Omit<ChipsInputProps, 'value' | 'onValueChange'>> {
  /**
   * The chips the harness starts with.
   */
  initialValue?: string[];
}

/**
 * Renders a chips input with its chips kept in local state.
 */
function Harness({ initialValue = [], ...props }: HarnessProps) {
  const [value, setValue] = useState(initialValue);

  return <ChipsInput value={value} onValueChange={setValue} {...props} />;
}

describe('<ChipsInput />', () => {
  afterEach(cleanup);

  it('adds the typed value on Enter', async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.type(screen.getByRole('textbox'), 'stl{Enter}');

    expect(screen.getByText('stl')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('adds the typed value on comma', async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.type(screen.getByRole('textbox'), 'stl,');

    expect(screen.getByText('stl')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('adds the typed value on blur', async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.type(screen.getByRole('textbox'), 'stl');
    await user.tab();

    expect(screen.getByText('stl')).toBeInTheDocument();
  });

  it('adds each comma separated value in pasted text', async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.click(screen.getByRole('textbox'));
    await user.paste('stl, obj');
    await user.keyboard('{Enter}');

    expect(screen.getByText('stl')).toBeInTheDocument();
    expect(screen.getByText('obj')).toBeInTheDocument();
  });

  it('keeps spaces in a value by default', async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.type(screen.getByRole('textbox'), 'two words{Enter}');

    expect(screen.getByText('two words')).toBeInTheDocument();
  });

  it('adds the typed value on Space when splitting on it', async () => {
    const user = userEvent.setup();

    render(<Harness splitOnSpace />);

    await user.type(screen.getByRole('textbox'), 'stl ');

    expect(screen.getByText('stl')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('splits pasted text on spaces when splitting on them', async () => {
    const user = userEvent.setup();

    render(<Harness splitOnSpace />);

    await user.click(screen.getByRole('textbox'));
    await user.paste('stl obj');
    await user.keyboard('{Enter}');

    expect(screen.getByText('stl')).toBeInTheDocument();
    expect(screen.getByText('obj')).toBeInTheDocument();
  });

  it('keeps only the rejected values in the input', async () => {
    const user = userEvent.setup();

    render(<Harness splitOnSpace validate={(value) => value !== 'obj'} />);

    await user.click(screen.getByRole('textbox'));
    await user.paste('stl obj');
    await user.keyboard('{Enter}');

    expect(screen.getByText('stl')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('obj');
  });

  it('ignores blank values', async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.type(screen.getByRole('textbox'), '  {Enter}');

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('normalizes the typed value', async () => {
    const user = userEvent.setup();

    render(<Harness normalize={(value) => value.toLowerCase()} />);

    await user.type(screen.getByRole('textbox'), 'STL{Enter}');

    expect(screen.getByText('stl')).toBeInTheDocument();
  });

  it('skips values already added', async () => {
    const user = userEvent.setup();

    render(<Harness initialValue={['stl']} />);

    await user.type(screen.getByRole('textbox'), 'stl{Enter}');

    expect(screen.getAllByText('stl')).toHaveLength(1);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('leaves a rejected value in the input', async () => {
    const user = userEvent.setup();

    render(<Harness validate={() => false} />);

    await user.type(screen.getByRole('textbox'), 'stl{Enter}');

    expect(screen.queryByText('stl')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('stl');
  });

  it('removes a chip from its button', async () => {
    const user = userEvent.setup();

    render(<Harness initialValue={['stl', 'obj']} />);

    await user.click(screen.getByRole('button', { name: 'Remove stl' }));

    expect(screen.queryByText('stl')).not.toBeInTheDocument();
    expect(screen.getByText('obj')).toBeInTheDocument();
  });

  it('leaves chips alone when the label around them is clicked', async () => {
    const user = userEvent.setup();

    render(<Harness initialValue={['stl']} />);

    // Click the chip's text. This activates the wrapping label.
    await user.click(screen.getByText('stl'));

    expect(screen.getByText('stl')).toBeInTheDocument();
  });

  it('ignores a value which normalizes to an empty string', async () => {
    const user = userEvent.setup();

    render(<Harness normalize={(value) => value.replace(/\W/g, '')} />);

    await user.type(screen.getByRole('textbox'), '---{Enter}');

    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('removes the last chip on Backspace in the empty input', async () => {
    const user = userEvent.setup();

    render(<Harness initialValue={['stl', 'obj']} />);

    await user.type(screen.getByRole('textbox'), '{Backspace}');

    expect(screen.getByText('stl')).toBeInTheDocument();
    expect(screen.queryByText('obj')).not.toBeInTheDocument();
  });

  it('leaves chips alone on Backspace while text is typed', async () => {
    const user = userEvent.setup();

    render(<Harness initialValue={['stl']} />);

    await user.type(screen.getByRole('textbox'), 'o{Backspace}');

    expect(screen.getByText('stl')).toBeInTheDocument();
  });
});
