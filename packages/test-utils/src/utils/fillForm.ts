import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function fillForm(fields: Record<string, string>) {
  const user = userEvent.setup();

  for (const [name, value] of Object.entries(fields)) {
    // Get all textboxes in the document
    const input = screen
      .getAllByRole('textbox')
      .find((el) => (el as HTMLInputElement).name === name);

    if (!input) {
      throw new Error(`Input field with name "${name}" not found`);
    }

    await user.clear(input);

    if (value !== '') {
      await user.type(input, value);
    }
  }
}
