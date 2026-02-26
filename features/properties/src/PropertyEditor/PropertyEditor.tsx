import { SelectPropertySchema } from '@minddrop/properties';
import {
  PropertyEditorBase,
  PropertyEditorBaseProps,
} from './PropertyEditorBase';
import { SelectPropertyEditor } from './SelectPropertyEditor';

export type PropertyEditorProps = Omit<PropertyEditorBaseProps, 'children'>;

export const PropertyEditor: React.FC<PropertyEditorProps> = (props) => {
  if (props.property.type === 'select') {
    return (
      <SelectPropertyEditor
        {...props}
        property={props.property as SelectPropertySchema}
      />
    );
  }

  return <PropertyEditorBase {...props} />;
};
