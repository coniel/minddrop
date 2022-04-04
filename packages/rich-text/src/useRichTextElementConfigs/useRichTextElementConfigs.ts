import { RichTextElementConfig } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Returns an array containing all of the rregistered rich text
 * element type configurations in the order in which they were
 * registered.
 *
 * @returns Reigstered rich text element type configs.
 */
export function useRichTextElementConfigs(): RichTextElementConfig[] {
  // Get the registered rich text element configs and the
  // order in which they were registered.
  const { order, configs } = useRichTextStore((state) => ({
    order: state.registrationOrder,
    configs: state.elementConfigs,
  }));

  // Return the configs in the order in which they were registered
  return order.map((id) => configs[id]);
}
