import {
  BaseInlineElement,
  BaseVoidBlockElement,
  TextBlockElement,
  InlineElement,
  VoidBlockElement,
  ContainerBlockElement,
  BaseContainerBlockElement,
  BaseBlockElement,
} from '../types';
import { TextElement } from '../types/TextElement.types';

export function generateTextElement(
  text = '',
  marks: Omit<TextElement, 'text'> = {},
): TextElement {
  return {
    ...marks,
    text,
  };
}

export function generateBlockElement<
  TElement extends TextBlockElement = TextBlockElement,
>(
  type: TElement['type'],
  data: Omit<TElement, keyof BaseVoidBlockElement> &
    Partial<Pick<BaseBlockElement, 'children'>> = {} as Omit<
    TElement,
    keyof BaseVoidBlockElement
  >,
): TElement {
  return {
    children: [generateTextElement()],
    ...data,
    type,
    display: 'block',
  } as TElement;
}

export function generateContainerBlockElement<
  TElement extends ContainerBlockElement = ContainerBlockElement,
>(
  type: TElement['type'],
  data: Omit<TElement, keyof BaseContainerBlockElement> &
    Partial<Pick<BaseContainerBlockElement, 'children'>> = {} as Omit<
    TElement,
    keyof BaseContainerBlockElement
  >,
): TElement {
  return {
    children: [generateBlockElement('paragraph')],
    ...data,
    type,
    display: 'block',
    isContainer: true,
  } as TElement;
}

export function generateVoidBlockElement<
  TElement extends VoidBlockElement = VoidBlockElement,
>(
  type: TElement['type'],
  data: Omit<TElement, keyof BaseVoidBlockElement>,
): TElement {
  return {
    ...data,
    ...generateBlockElement(type, data),
    isVoid: true,
    children: [{ text: '' }],
  } as TElement;
}

export function generateInlineElement<
  TElement extends InlineElement = InlineElement,
>(
  type: TElement['type'],
  data: Omit<TElement, keyof BaseInlineElement> &
    Partial<Pick<BaseInlineElement, 'children'>> = {} as Omit<
    TElement,
    keyof BaseInlineElement
  >,
): TElement {
  return {
    children: [generateTextElement()],
    ...data,
    type,
    display: 'inline',
  } as TElement;
}

export function generateVoidInlineElement<
  TElement extends InlineElement = InlineElement,
>(
  type: TElement['type'],
  data: Omit<TElement, keyof BaseInlineElement>,
): TElement {
  return {
    ...data,
    isVoid: true,
    ...generateInlineElement(type, data),
    children: [{ text: '' }],
  } as TElement;
}
