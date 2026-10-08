import { DesignElement, ElementCornerRadius } from '@minddrop/designs-next';
import { ChipSize } from '@minddrop/ui-primitives';

export interface ChipsElement extends DesignElement {
  /**
   * The corner radius the chips are drawn with. Small by default.
   */
  cornerRadius?: ElementCornerRadius;

  /**
   * The size the chips are drawn at. Medium by default.
   */
  size?: ChipSize;
}
