import {
  DesignRoles,
  getRoleVariantAxes,
  isRoleElement,
} from '@minddrop/designs';
import { SelectField, SelectOption, Text } from '@minddrop/ui-primitives';
import {
  useActiveLayoutType,
  useDesignStudio,
  useElement,
} from '../DesignStudioStore';
import { PanelSection } from './PanelSection';
import { StyleEditorProps } from './StyleEditorProps';
import { sectionLabelKey } from './styleI18nKeys';

/**
 * Renders one select per variant axis of the element's design
 * role. Axes compose, so a role can offer a size and an intent
 * without enumerating every combination. Renders nothing for
 * elements without a role or a role offering no variants.
 */
export const RoleVariantFields: React.FC<StyleEditorProps> = ({
  elementId,
}) => {
  const studio = useDesignStudio();
  const element = useElement(elementId);
  // The editor edits the active layout, which decides the axes the
  // role offers
  const layoutType = useActiveLayoutType();

  // Only role elements carry variants
  if (!isRoleElement(element)) {
    return null;
  }

  const role = DesignRoles.Store.get(element.role);

  // An unregistered role offers nothing to choose
  if (!role) {
    return null;
  }

  // The axes offered in the active layout's context
  const axes = getRoleVariantAxes(role, layoutType ?? undefined);

  // A role with a single fixed look in this context offers nothing
  // to choose
  if (!axes.length) {
    return null;
  }

  const roleElement = element;

  // Record the chosen option for an axis, leaving the other axes
  // as they are. Replaces the element outright, since the role
  // fields sit alongside the element's own.
  function handleAxisChange(axisId: string, optionId: string | number) {
    const updatedElement = {
      ...roleElement,
      roleVariants: {
        ...roleElement.roleVariants,
        [axisId]: String(optionId),
      },
    };

    studio.setDesignElement(elementId, updatedElement);
  }

  return (
    <PanelSection label={sectionLabelKey('variants')}>
      {axes.map((axis) => {
        // Options in their declared order, which is the order the
        // role author intended them to be read in
        const options: SelectOption<string>[] = axis.options.map((option) => ({
          value: option.id,
          label: option.label,
        }));

        return (
          <SelectField
            key={axis.id}
            size="sm"
            variant="subtle"
            label={axis.label}
            labelSize="xs"
            options={options}
            value={element.roleVariants?.[axis.id] ?? axis.defaultOption}
            onValueChange={(optionId) => handleAxisChange(axis.id, optionId)}
          />
        );
      })}
      <Text
        size="xs"
        color="subtle"
        text="designsStudio.variants.description"
      />
    </PanelSection>
  );
};
