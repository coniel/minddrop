import { screen, userEvent, waitFor } from '../testing-library-react';

export const emojiIcon = '😀';
export const emojiIconString = `emoji:${emojiIcon}:1`;

/**
 * Picks an emoji icon from an emoji icon picker.
 *
 * @param label - The label of the icon picker button.
 */
export async function pickEmojiIcon(label: string) {
  const user = userEvent.setup();

  // Open icon picker
  await user.click(screen.getByLabelText(label));

  // Wait for icon picker to open
  await waitFor(() => {
    screen.getByText('emojiPicker.label');
  });

  // Select an emoji
  await user.click(screen.getByText('emojiPicker.label'));

  // Narrow the results by searching. The picker virtualises its full grid,
  // which measures zero height in jsdom and renders no rows; a narrow result
  // set renders as a plain list instead.
  await user.type(
    screen.getByPlaceholderText('emojiPicker.filter'),
    'grinning',
  );

  await waitFor(() => {
    screen.getByText(emojiIcon);
  });

  await user.click(screen.getByText(emojiIcon));
}
