import { DataViewTypes } from '@minddrop/data-views';
import {
  DataViewElementConfig,
  DesignElementConfig,
  DesignRoleConfig,
  DesignRoles,
  DesignType,
  ElementGroup,
  LayoutType,
  getElementConfigs,
  getPropertyElementConfigs,
} from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { MenuGroup, MenuLabel } from '@minddrop/ui-primitives';
import {
  useActiveLayoutType,
  useDesignStudioStore,
} from '../DesignStudioStore';
import { isElementInContext } from '../utils';
import { DataViewTypePaletteItem } from './DataViewTypePaletteItem';
import { ElementPaletteItem } from './ElementPaletteItem';
import { PropertyElementPaletteItem } from './PropertyElementPaletteItem';
import { RolePaletteItem } from './RolePaletteItem';
import './ElementsPalette.css';

/**
 * The element groups listed after the properties, in display
 * order.
 */
const ElementGroups: { group: ElementGroup; label: TranslationKey }[] = [
  { group: 'layout', label: 'design-studio.elements.group.layout' },
];

/**
 * Renders the studio's element palette: the property elements
 * insertable in the current design and layout, followed by the
 * layout chrome group holding grouped element types and roles.
 */
export const ElementsPalette: React.FC = () => {
  const designType = useDesignStudioStore((state) => state.design?.type);
  const layoutType = useActiveLayoutType();
  const dataViewTypes = DataViewTypes.useAll();

  // Property elements insertable in the current design and layout
  const propertyElements = getPropertyElementConfigs().filter((config) =>
    isElementInContext(config.context, { designType, layoutType }),
  );

  // Data view elements are listed one per registered data view
  // type, gated on the element being insertable here
  const dataViewsInContext = isElementInContext(DataViewElementConfig.context, {
    designType,
    layoutType,
  });

  // Grouped element types and roles insertable in the current
  // design and layout
  const elementGroups = resolveElementGroups(designType, layoutType);

  return (
    <div className="designs-elements-palette">
      {propertyElements.length > 0 && (
        <MenuGroup>
          <MenuLabel label="design-studio.elements.group.properties" />
          {propertyElements.map((config) => (
            <PropertyElementPaletteItem
              key={config.propertyType}
              config={config}
            />
          ))}
        </MenuGroup>
      )}

      {dataViewsInContext && dataViewTypes.length > 0 && (
        <MenuGroup>
          <MenuLabel label="design-studio.elements.group.views" />
          {dataViewTypes.map((dataViewType) => (
            <DataViewTypePaletteItem
              key={dataViewType.type}
              dataViewType={dataViewType}
            />
          ))}
        </MenuGroup>
      )}

      {elementGroups.map(({ label, configs, roles }) => (
        <MenuGroup key={label}>
          <MenuLabel label={label} />
          {configs.map((config) => (
            <ElementPaletteItem key={config.type} config={config} />
          ))}
          {roles.map((role) => (
            <RolePaletteItem key={role.id} role={role} />
          ))}
        </MenuGroup>
      ))}
    </div>
  );
};

/**
 * Buckets the element types and roles insertable in the given
 * context by their palette group, dropping groups left empty.
 * Element types and roles without a group are created by the
 * studio rather than dragged, so they never appear.
 */
function resolveElementGroups(
  designType: DesignType | undefined,
  layoutType: LayoutType | null,
): {
  label: TranslationKey;
  configs: DesignElementConfig[];
  roles: DesignRoleConfig[];
}[] {
  // Element types insertable in the current design and layout
  const configs = getElementConfigs().filter((config) =>
    isElementInContext(config.context, { designType, layoutType }),
  );

  // Roles compatible with the current design and layout, minus
  // the structural ones created by their parent layout
  const roles = DesignRoles.getCompatible({
    designType,
    layoutType: layoutType ?? undefined,
  }).filter((role) => !role.structural);

  return ElementGroups.map(({ group, label }) => ({
    label,
    configs: configs.filter((config) => config.group === group),
    roles: roles.filter((role) => role.group === group),
  })).filter(
    ({ configs: groupConfigs, roles: groupRoles }) =>
      groupConfigs.length > 0 || groupRoles.length > 0,
  );
}
