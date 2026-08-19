import { DesignElementStyle } from '../../styles';
import {
  DesignRoleConfig,
  DesignRoleVariant,
  DesignRoleVariantAxis,
  LayoutType,
} from '../../types';
import { getRoleVariantAxes } from '../getRoleVariantAxes';

/**
 * Resolves the style values a role applies to an element in the
 * given layout context: the role's locked styles with the layout
 * type's context styles applied over them, then each applicable
 * variant axis' selected option on top. Every key in the result is
 * locked, so the same resolution drives both style output and
 * which keys the editors withhold.
 *
 * @param role - The role to resolve.
 * @param roleVariants - The element's variant selections by axis ID.
 * @param layoutType - The type of the layout the element is in.
 * @returns The style values the role applies.
 */
export function resolveRoleStyle(
  role: DesignRoleConfig,
  roleVariants: Record<string, string> | undefined,
  layoutType?: LayoutType,
): Partial<DesignElementStyle> {
  // The role's locked styles with the layout context's overrides
  // applied over them
  let style: Partial<DesignElementStyle> = {
    ...role.lockedStyle,
    ...(layoutType ? role.contextStyles?.[layoutType] : undefined),
  };

  // Apply the selected option of each axis offered in the context
  getRoleVariantAxes(role, layoutType).forEach((axis) => {
    const option = resolveSelectedOption(axis, roleVariants?.[axis.id]);

    // An axis with no resolvable option contributes nothing
    if (!option) {
      return;
    }

    // The option's context-independent styles with its layout
    // context's overrides applied over them
    style = {
      ...style,
      ...option.style,
      ...(layoutType ? option.contextStyles?.[layoutType] : undefined),
    };
  });

  return style;
}

/**
 * Resolves the option applied on an axis: the element's selection
 * when it names a known option, falling back to the axis default
 * when the selection is missing or unknown.
 */
function resolveSelectedOption(
  axis: DesignRoleVariantAxis,
  selectedId: string | undefined,
): DesignRoleVariant | undefined {
  // Prefer the element's own selection
  const selected = axis.options.find((option) => option.id === selectedId);

  if (selected) {
    return selected;
  }

  // Fall back to the axis default
  return axis.options.find((option) => option.id === axis.defaultOption);
}
