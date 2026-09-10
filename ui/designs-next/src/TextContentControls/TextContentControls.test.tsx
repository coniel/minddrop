import { afterEach, describe, expect, it } from 'vitest';
import { DesignElement } from '@minddrop/designs-next';
import { bodyDesignElement } from '@minddrop/designs-next/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../test-utils';
import { TextContentControls } from './TextContentControls';

// The content passed to the most recent change callback
let changedContent: string | undefined | null;

const element: DesignElement = {
  ...bodyDesignElement,
  content: 'Body',
};

/**
 * Renders the content input in a toolbar and opens its popover.
 */
async function openInput() {
  changedContent = null;

  render(
    <FloatingToolbar visible>
      <TextContentControls
        element={element}
        onContentChange={(content) => {
          changedContent = content;
        }}
      />
    </FloatingToolbar>,
  );

  await userEvent.click(screen.getByLabelText('designsNext.content.label'));
}

describe('TextContentControls', () => {
  afterEach(cleanup);

  it("opens the element's text in a multiline input", async () => {
    await openInput();

    expect(screen.getByRole('textbox')).toHaveValue('Body');
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('closes through the done button', async () => {
    await openInput();

    await userEvent.click(screen.getByText('Done'));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('clears the text through the clear button', async () => {
    await openInput();

    await userEvent.click(screen.getByText('Clear'));

    expect(changedContent).toBeUndefined();
  });

  it('reports the text as it is typed', async () => {
    await openInput();

    await userEvent.type(screen.getByRole('textbox'), '!');

    expect(changedContent).toBe('Body!');
  });
});
