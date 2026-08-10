import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@minddrop/test-utils';
import { CanvasNameField } from './CanvasNameField';

describe('CanvasNameField', () => {
  afterEach(cleanup);

  it('renders the name', () => {
    const { getByDisplayValue } = render(<CanvasNameField name="My canvas" />);

    expect(getByDisplayValue('My canvas')).toBeInTheDocument();
  });

  it('commits the trimmed name on blur', () => {
    let committed = '';

    const { getByDisplayValue } = render(
      <CanvasNameField
        name="My canvas"
        onNameChange={(name) => {
          committed = name;
        }}
      />,
    );

    const input = getByDisplayValue('My canvas');

    fireEvent.change(input, { target: { value: '  Renamed  ' } });
    fireEvent.blur(input);

    expect(committed).toBe('Renamed');
  });

  it('reverts to the current name when left blank', () => {
    let committed = '';

    const { getByDisplayValue } = render(
      <CanvasNameField
        name="My canvas"
        onNameChange={(name) => {
          committed = name;
        }}
      />,
    );

    const input = getByDisplayValue('My canvas');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.blur(input);

    expect(committed).toBe('');
    expect(getByDisplayValue('My canvas')).toBeInTheDocument();
  });

  it('does not commit an unchanged name', () => {
    let committed = '';

    const { getByDisplayValue } = render(
      <CanvasNameField
        name="My canvas"
        onNameChange={(name) => {
          committed = name;
        }}
      />,
    );

    fireEvent.blur(getByDisplayValue('My canvas'));

    expect(committed).toBe('');
  });

  it('follows the name when it changes elsewhere', () => {
    const { getByDisplayValue, rerender } = render(
      <CanvasNameField name="My canvas" />,
    );

    rerender(<CanvasNameField name="Renamed elsewhere" />);

    expect(getByDisplayValue('Renamed elsewhere')).toBeInTheDocument();
  });
});
