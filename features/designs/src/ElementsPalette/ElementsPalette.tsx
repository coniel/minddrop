import {
  DesignElementConfig,
  DesignRoles,
  DesignType,
  ElementGroup,
  LayoutType,
  getElementConfigs,
} from '@minddrop/designs';
import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';
import { MenuGroup, MenuLabel } from '@minddrop/ui-primitives';
import {
  useActiveLayoutType,
  useDesignStudioStore,
} from '../DesignStudioStore';
import { isElementInContext } from '../utils';
import { ElementPaletteItem } from './ElementPaletteItem';
import { RolePaletteItem } from './RolePaletteItem';
import './ElementsPalette.css';

// Names the role group after the layout being edited, e.g.
// "Card elements", falling back to a plain label when no layout
// is active
const paletteElementsKey = createI18nKeyBuilder(
  'designsStudio.palette.elements.',
);

/**
 * The element groups listed after the roles, in display order.
 */
const ElementGroups: { group: ElementGroup; label: TranslationKey }[] = [
  { group: 'elements', label: 'design-studio.elements.group.elements' },
  { group: 'media', label: 'design-studio.elements.group.media' },
  { group: 'layout', label: 'design-studio.elements.group.layout' },
];

/**
 * Renders the studio's element palette: the design roles available
 * in the current design and layout, followed by the unstyled
 * element types they are built from.
 */
export const ElementsPalette: React.FC = () => {
  const designType = useDesignStudioStore((state) => state.design?.type);
  const layoutType = useActiveLayoutType();

  // Roles compatible with the current design and layout, minus the
  // structural ones created by their parent layout
  const roles = DesignRoles.getCompatible({
    designType,
    layoutType: layoutType ?? undefined,
  }).filter((role) => !role.structural);

  // Element types insertable in the current design and layout,
  // bucketed by their palette group
  const elementGroups = resolveElementGroups(designType, layoutType);

  return (
    <div className="designs-elements-palette">
      {roles.length > 0 && (
        <MenuGroup>
          <MenuLabel label={paletteElementsKey(layoutType ?? 'default')} />
          {roles.map((role) => (
            <RolePaletteItem key={role.id} role={role} />
          ))}
        </MenuGroup>
      )}

      {elementGroups.map(({ label, configs }) => (
        <MenuGroup key={label}>
          <MenuLabel label={label} />
          {configs.map((config) => (
            <ElementPaletteItem key={config.type} config={config} />
          ))}
        </MenuGroup>
      ))}
    </div>
  );
};

/**
 * Buckets the element types insertable in the given context by
 * their palette group, dropping groups left empty. Element types
 * without a group are created by the studio rather than dragged,
 * so they never appear.
 */
function resolveElementGroups(
  designType: DesignType | undefined,
  layoutType: LayoutType | null,
): { label: TranslationKey; configs: DesignElementConfig[] }[] {
  const configs = getElementConfigs().filter((config) =>
    isElementInContext(config.context, { designType, layoutType }),
  );

  return ElementGroups.map(({ group, label }) => ({
    label,
    configs: configs.filter((config) => config.group === group),
  })).filter(({ configs: groupConfigs }) => groupConfigs.length > 0);
}
