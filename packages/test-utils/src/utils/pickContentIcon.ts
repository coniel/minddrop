import { screen, userEvent, waitFor } from '../testing-library-react';

export const pickedContentIconName = 'squirrel';
export const pickedContentIconString = 'lucide:squirrel:default';

/**
 * Picks a content icon from an icon picker.
 *
 * @param label - The label of the icon picker button.
 */
export async function pickContentIcon(label: string) {
  const user = userEvent.setup();

  // Open icon picker
  await user.click(screen.getByLabelText(label));

  // Wait for the picker to open
  await waitFor(() => {
    screen.getByPlaceholderText('iconPicker.filter');
  });

  // Narrow the results by searching for a name with a single fuzzy match.
  // The picker virtualises its full grid, which measures zero height in
  // jsdom and renders no rows; a narrow result set renders as a plain list
  // instead.
  await user.type(
    screen.getByPlaceholderText('iconPicker.filter'),
    pickedContentIconName,
  );

  // Wait for the icon set to load and the icon to render
  await waitFor(() => {
    screen.getByLabelText(pickedContentIconName);
  });

  await user.click(screen.getByLabelText(pickedContentIconName));
}
