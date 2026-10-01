import { describe, expect, it } from 'vitest';
import { resolveClosestElement } from './resolveClosestElement';

// A slot holding a paragraph with a text node
const slot = document.createElement('div');
const paragraph = document.createElement('p');
const text = document.createTextNode('text');

// Mark the slot and nest the nodes
slot.dataset.slot = 'slot';
paragraph.appendChild(text);
slot.appendChild(paragraph);

describe('resolveClosestElement', () => {
  it('resolves the matching ancestor of a text node', () => {
    expect(resolveClosestElement(text, '[data-slot]')).toBe(slot);
  });

  it('resolves an element matching the selector itself', () => {
    expect(resolveClosestElement(slot, '[data-slot]')).toBe(slot);
  });

  it('returns null when no ancestor matches', () => {
    expect(resolveClosestElement(text, '[data-missing]')).toBeNull();
  });

  it('returns null for no node', () => {
    expect(resolveClosestElement(null, '[data-slot]')).toBeNull();
  });
});
