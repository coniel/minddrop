import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface ColorPropertySchema extends PropertySchemaBase {
  type: 'color';
}

// Meta so it appears in the metadata property group and can only be
// added once, but deliberately not part of MetadataPropertySchemas:
// the color is read from entry metadata directly, so it is never
// implicitly injected into database schemas or seeded into designs
export const ColorPropertySchema: PropertySchemaTemplate<ColorPropertySchema> =
  {
    type: 'color',
    icon: 'content-icon:palette:default',
    name: 'properties.color.name',
    description: 'properties.color.description',
    meta: true,
  };
