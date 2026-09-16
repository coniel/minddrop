import { afterEach, describe, expect, it } from 'vitest';
import { DesignElement } from '@minddrop/designs-next';
import { iconDesignElement } from '@minddrop/designs-next/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../test-utils';
import { IconContentControls } from './IconContentControls';

// The content passed to the most recent change callback
let changedContent: string | undefined | null;

const element: DesignElement = {
  ...iconDesignElement,
  content: 'lucide:star:default',
};

/**
 * Renders the icon control in a toolbar and opens its picker.
 */
async function openPicker() {
  changedContent = null;

  render(
    <FloatingToolbar visible>
      <IconContentControls
        element={element}
        onContentChange={(content) => {
          changedContent = content;
        }}
      />
    </FloatingToolbar>,
  );

  await userEvent.click(screen.getByLabelText('designsNext.content.iconLabel'));
}

describe('IconContentControls', () => {
  afterEach(cleanup);

  it("opens the element's icon in a picker", async () => {
    await openPicker();

    expect(
      screen.getByPlaceholderText('iconPicker.filter'),
    ).toBeInTheDocument();
  });

  it('clears the icon through the clear button', async () => {
    await openPicker();

    await userEvent.click(screen.getByText('Clear'));

    expect(changedContent).toBeUndefined();
  });
});
