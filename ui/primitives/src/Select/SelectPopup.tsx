import { Select as SelectPrimitive } from '@base-ui/react/select';
import { propsToClass } from '../utils';

/* --- SelectPopup ---
   Wraps the entire dropdown shell: Portal → Positioner → Popup →
   ScrollArrows → List. */

export interface SelectPopupProps {
  /*
   * Additional class name applied to the popup element.
   */
  className?: string;

  /*
   * Offset of the popup along the alignment axis (px).
   */
  alignOffset?: number;

  /*
   * The popup content (select items).
   */
  children: React.ReactNode;
}

export const SelectPopup = ({
  className,
  alignOffset,
  children,
}: SelectPopupProps) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Positioner
      className="select-positioner"
      sideOffset={8}
      alignOffset={alignOffset}
    >
      <SelectPrimitive.Popup
        className={propsToClass('select-popup', { className })}
      >
        <SelectPrimitive.ScrollUpArrow className="select-scroll-arrow" />
        <SelectPrimitive.List className="select-list">
          {children}
        </SelectPrimitive.List>
        <SelectPrimitive.ScrollDownArrow className="select-scroll-arrow" />
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Portal>
);
