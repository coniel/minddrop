import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { waitFor } from '@minddrop/test-utils';
import { createDataTransfer } from '@minddrop/utils/test-utils';
import { cleanup, setup } from '../test-utils';
import { initializeDropAndPaste } from './initializeDropAndPaste';

const { objectDatabase, databaseEntries } = DatabaseFixtures;

/**
 * Creates a dragover, drop or paste event transferring plain text.
 *
 * @param type - The event type.
 * @param text - The plain text the event transfers.
 * @returns The event.
 */
function createTransferEvent(
  type: 'dragover' | 'drop' | 'paste',
  text: string,
): Event {
  // Create the event and its transfer data
  const event = new Event(type, { bubbles: true, cancelable: true });
  const dataTransfer = createDataTransfer({ 'text/plain': text });

  // Attach the data as the event type's transfer property
  Object.defineProperty(
    event,
    type === 'paste' ? 'clipboardData' : 'dataTransfer',
    { value: dataTransfer },
  );

  return event;
}

/**
 * Waits for pending entry creation. Gives a wrongly taken event time
 * to create its entry.
 *
 * @returns A promise which resolves once pending entry creation ran.
 */
function settle(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('initializeDropAndPaste', () => {
  let removeListeners: VoidFunction;

  beforeEach(() => {
    setup();

    // Set the object database as the default for text content
    Databases.setContentDefault('text', objectDatabase.id);

    // Register the listeners
    removeListeners = initializeDropAndPaste();
  });

  afterEach(async () => {
    removeListeners();

    await cleanup();
  });

  it('adds pasted content to its default database', async () => {
    document.body.dispatchEvent(createTransferEvent('paste', 'Pasted'));

    await waitFor(() => {
      expect(DatabaseEntries.Store).toHaveItemCount(databaseEntries.length + 1);
    });
  });

  it('adds dropped content to its default database', async () => {
    document.body.dispatchEvent(createTransferEvent('drop', 'Dropped'));

    await waitFor(() => {
      expect(DatabaseEntries.Store).toHaveItemCount(databaseEntries.length + 1);
    });
  });

  it('takes the drop', () => {
    const event = createTransferEvent('drop', 'Dropped');

    document.body.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('allows native drags to be dropped as a copy', () => {
    const event = createTransferEvent('dragover', 'Dragged');

    document.body.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect((event as DragEvent).dataTransfer?.dropEffect).toBe('copy');
  });

  it('leaves drags a drop target accepted to it', () => {
    // A drop target accepting every drag
    const target = document.createElement('div');
    target.addEventListener('dragover', (event) => event.preventDefault());
    document.body.appendChild(target);

    // Drag over the target
    const event = createTransferEvent('dragover', 'Dragged');
    target.dispatchEvent(event);

    expect((event as DragEvent).dataTransfer?.dropEffect).not.toBe('copy');

    target.remove();
  });

  it('leaves drops a drop target took to it', async () => {
    // A drop target taking every drop
    const target = document.createElement('div');
    target.addEventListener('drop', (event) => event.preventDefault());
    document.body.appendChild(target);

    // Drop onto the target
    target.dispatchEvent(createTransferEvent('drop', 'Taken'));

    await settle();

    expect(DatabaseEntries.Store).toHaveItems(databaseEntries);

    target.remove();
  });

  it('leaves drops onto editable controls to them', async () => {
    // Add an input to drop into
    const input = document.createElement('input');
    document.body.appendChild(input);

    // Drop onto the input
    input.dispatchEvent(createTransferEvent('drop', 'Typed'));

    await settle();

    expect(DatabaseEntries.Store).toHaveItems(databaseEntries);

    input.remove();
  });

  it('leaves pastes already handled alone', async () => {
    // A control handling every paste
    const target = document.createElement('div');
    target.addEventListener('paste', (event) => event.preventDefault());
    document.body.appendChild(target);

    // Paste into the target
    target.dispatchEvent(createTransferEvent('paste', 'Handled'));

    await settle();

    expect(DatabaseEntries.Store).toHaveItems(databaseEntries);

    target.remove();
  });

  it('leaves pastes into editable controls to them', async () => {
    // Add an input to paste into
    const input = document.createElement('input');
    document.body.appendChild(input);

    // Paste into the input
    input.dispatchEvent(createTransferEvent('paste', 'Typed'));

    await settle();

    expect(DatabaseEntries.Store).toHaveItems(databaseEntries);

    input.remove();
  });

  it('stops listening once removed', async () => {
    removeListeners();

    document.body.dispatchEvent(createTransferEvent('paste', 'Pasted'));

    await settle();

    expect(DatabaseEntries.Store).toHaveItems(databaseEntries);
  });
});
