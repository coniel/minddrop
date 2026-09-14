import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyFilterOperator } from '@minddrop/filters';
import { PropertySchema } from '@minddrop/properties';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { PropertyFilterOperatorSelect } from './PropertyFilterOperatorSelect';

const toggleProperty: PropertySchema = { type: 'toggle', name: 'Active' };

describe('<PropertyFilterOperatorSelect />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("lists the property type's operators", async () => {
    const user = userEvent.setup();

    render(
      <PropertyFilterOperatorSelect
        property={toggleProperty}
        value=""
        onValueChange={() => {}}
      />,
    );

    await user.click(screen.getByText('Operator'));

    // Toggle properties compare on and off only
    expect(screen.getByRole('option', { name: 'is on' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'is off' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'is empty' })).toBeNull();
  });

  it('reports the picked operator', async () => {
    const user = userEvent.setup();
    let picked: PropertyFilterOperator | undefined;

    render(
      <PropertyFilterOperatorSelect
        property={toggleProperty}
        value=""
        onValueChange={(operator) => {
          picked = operator;
        }}
      />,
    );

    await user.click(screen.getByText('Operator'));
    await user.click(screen.getByRole('option', { name: 'is off' }));

    expect(picked).toBe('is-false');
  });
});
