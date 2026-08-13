import { RootElement } from '../../design-element-configs';

/**
 * Checks whether a page root is in panelled mode, i.e. it holds
 * panel/content region children rather than free-form content.
 *
 * @param root - The page root element.
 * @returns Whether the root is panelled.
 */
export function isPanelledRoot(root: RootElement): boolean {
  return root.children.some(
    (child) =>
      child.type === 'page-panel' ||
      (child.type === 'container' && child.role === 'content'),
  );
}
