import { DesignType, ElementContext, LayoutType } from '@minddrop/designs';

/**
 * The insertion context an element is checked against.
 */
export interface ElementInsertionContext {
  /**
   * The type of the design being edited.
   */
  designType?: DesignType;

  /**
   * The type of the layout being edited.
   */
  layoutType?: LayoutType | null;
}

/**
 * Checks whether an element may be inserted in the given context.
 * The element's context lists the design types and layout types it
 * allows; a list the element omits allows all of them. The check
 * only excludes on a definite mismatch, so an unknown design or
 * layout type also passes.
 *
 * @param context - The element's insertion context, omitted when unrestricted.
 * @param insertionContext - The context the element would be inserted into.
 * @returns Whether the element may be inserted.
 */
export function isElementInContext(
  context: ElementContext | undefined,
  insertionContext: ElementInsertionContext,
): boolean {
  // Elements without a context are insertable anywhere
  if (!context) {
    return true;
  }

  const { designType, layoutType } = insertionContext;

  // A restricted design type axis must include the context's design type
  if (
    context.designTypes &&
    designType &&
    !context.designTypes.includes(designType)
  ) {
    return false;
  }

  // A restricted layout type axis must include the context's layout type
  if (
    context.layoutTypes &&
    layoutType &&
    !context.layoutTypes.includes(layoutType)
  ) {
    return false;
  }

  return true;
}
