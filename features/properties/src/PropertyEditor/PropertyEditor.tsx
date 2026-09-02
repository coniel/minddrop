import { SelectPropertySchema, TagsPropertySchema } from '@minddrop/properties';
import {
  PropertyEditorBase,
  PropertyEditorBaseProps,
} from './PropertyEditorBase';
import { SelectPropertyEditor } from './SelectPropertyEditor';
import { TagsPropertyEditor } from './TagsPropertyEditor';

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

  if (props.property.type === 'tags') {
    return (
      <TagsPropertyEditor
        {...props}
        property={props.property as TagsPropertySchema}
      />
    );
  }

  return <PropertyEditorBase {...props} />;
};
