import { PropertySchema } from '@minddrop/properties';
import { ContentIcon, Text } from '@minddrop/ui-primitives';
import './AvailablePropertyElement.css';

export interface AvailablePropertyElementProps {
  property: PropertySchema;
}

export const AvailablePropertyElement: React.FC<
  AvailablePropertyElementProps
> = ({ property }) => {
  return (
    <div className="available-property-element">
      <ContentIcon icon={property.icon} />
      <Text size="small" weight="medium" text={property.name} />
    </div>
  );
};
