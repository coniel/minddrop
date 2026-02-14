import { describe, expect, it } from 'vitest';
import {
  CardElement,
  ContainerElement,
  StaticTextElement,
} from '../design-element-schema-templates';
import { RootElementTree } from '../types';
import { parseElementTree } from './parseElementTree';

describe('parseElementTree', () => {
  it('recursively parses an element tree into a [id]: [element] map', () => {
    const elementTree: RootElementTree = {
      ...CardElement,
      id: 'root',
      children: [
        {
          ...StaticTextElement,
          id: 'child-1',
        },
        {
          ...ContainerElement,
          id: 'child-2',
          children: [
            {
              ...StaticTextElement,
              id: 'child-2-1',
            },
          ],
        },
      ],
    };

    const parsedElementTree = parseElementTree(elementTree);

    expect(parsedElementTree).toEqual({
      root: {
        ...CardElement,
        id: 'root',
        children: ['child-1', 'child-2'],
      },
      'child-1': {
        id: 'child-1',
        ...StaticTextElement,
      },
      'child-2': {
        ...ContainerElement,
        id: 'child-2',
        children: ['child-2-1'],
      },
      'child-2-1': {
        id: 'child-2-1',
        ...StaticTextElement,
      },
    });
  });
});
