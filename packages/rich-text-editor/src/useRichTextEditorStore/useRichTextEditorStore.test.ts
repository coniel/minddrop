import {
  RICH_TEXT_TEST_DATA,
  UpdateRichTextElementData,
} from '@minddrop/rich-text';
import { useRichTextEditorStore } from './useRichTextEditorStore';

const { paragraphElement1, paragraphElement2 } = RICH_TEXT_TEST_DATA;

describe('useRichTextEditorStore', () => {
  it('adds a created element', () => {
    // Add a created element
    useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);
    // Add a second created element
    useRichTextEditorStore.getState().addCreatedElement(paragraphElement2);

    // Element should be added to `createdElements`
    expect(
      useRichTextEditorStore.getState().createdElements[paragraphElement1.id],
    ).toEqual(paragraphElement1);
    // Adds the element ID to the end of `creationOrder`
    expect(useRichTextEditorStore.getState().creationOrder).toEqual([
      paragraphElement1.id,
      paragraphElement2.id,
    ]);
  });

  it('removes a created element', () => {
    // Add a created element
    useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);
    // Remove the created element
    useRichTextEditorStore
      .getState()
      .removeCreatedElement(paragraphElement1.id);

    // Element should no longer be in `createdElements`
    expect(
      useRichTextEditorStore.getState().createdElements[paragraphElement1.id],
    ).toBeUndefined();
    // Removes the element ID from `creationOrder`
    expect(useRichTextEditorStore.getState().creationOrder).not.toContain(
      paragraphElement1.id,
    );
  });

  it('adds an updated element', () => {
    // The update data
    const data: UpdateRichTextElementData = {
      children: [{ text: 'Hello world' }],
    };

    // Add an updated element
    useRichTextEditorStore
      .getState()
      .addUpdatedElement(paragraphElement1.id, data);

    // Data should be added to `updatedElements`
    expect(
      useRichTextEditorStore.getState().updatedElements[paragraphElement1.id],
    ).toEqual(data);
  });

  it('removes an updated element', () => {
    // Add an updated element
    useRichTextEditorStore
      .getState()
      .addUpdatedElement(paragraphElement1.id, { children: [{ text: '' }] });
    // Remove the updated element
    useRichTextEditorStore
      .getState()
      .removeUpdatedElement(paragraphElement1.id);

    // Element should no longer be in `updatedElements`
    expect(
      useRichTextEditorStore.getState().updatedElements[paragraphElement1.id],
    ).toBeUndefined();
  });

  it('adds a deleted element', () => {
    // Add a deleted element
    useRichTextEditorStore.getState().addDeletedElement(paragraphElement1.id);

    // Element ID should be in `deletedElements`
    expect(useRichTextEditorStore.getState().deletedElements).toContain(
      paragraphElement1.id,
    );
  });

  it('removes a deleted element', () => {
    // Add a deleted element
    useRichTextEditorStore.getState().addDeletedElement(paragraphElement1.id);
    // Remove the deleted element
    useRichTextEditorStore
      .getState()
      .removeDeletedElement(paragraphElement1.id);

    // Element ID should no longer be in `deletedElements`
    expect(useRichTextEditorStore.getState().deletedElements).not.toContain(
      paragraphElement1.id,
    );
  });

  it('sets document children', () => {
    // Set document children
    useRichTextEditorStore
      .getState()
      .setDocumentChildren([paragraphElement1.id, paragraphElement2.id]);

    // Children should be set to the new value
    expect(useRichTextEditorStore.getState().documentChildren).toEqual([
      paragraphElement1.id,
      paragraphElement2.id,
    ]);
  });

  it('clears the store', () => {
    // Set data in the store
    useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);
    useRichTextEditorStore.getState().addUpdatedElement(paragraphElement1.id, {
      children: [{ text: 'Hello world' }],
    });
    useRichTextEditorStore.getState().addDeletedElement(paragraphElement1.id);
    useRichTextEditorStore
      .getState()
      .setDocumentChildren([paragraphElement1.id, paragraphElement2.id]);

    // Clear the store
    useRichTextEditorStore.getState().clear();

    // Get the store state
    const {
      createdElements,
      creationOrder,
      updatedElements,
      deletedElements,
      documentChildren,
    } = useRichTextEditorStore.getState();

    // Should clear `createdElements`
    expect(createdElements).toEqual({});
    // Should clear `creationOrder`
    expect(creationOrder).toEqual([]);
    // Should clear `updatedElements`
    expect(updatedElements).toEqual({});
    // Should clear `deletedElements`
    expect(deletedElements).toEqual([]);
    // Should clear `documentChildren`
    expect(documentChildren).toEqual([]);
  });
});
