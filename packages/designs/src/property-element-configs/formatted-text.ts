import { PropertyElementConfig } from '../types';

/**
 * The formatted text property element. Its Editor variant edits
 * the bound document in a rich content editor; its Display variant
 * renders the document read-only for contexts where inline editing
 * is not wanted (e.g. previews). Excluded from list layouts, where
 * a content document has no room to render.
 */
export const FormattedTextPropertyElementConfig: PropertyElementConfig = {
  propertyType: 'formatted-text',
  label: 'properties.textFormatted.name',
  icon: 'text-quote',
  bindsPropertyTypes: ['formatted-text'],
  defaultVariant: 'editor',
  context: { layoutTypes: ['card', 'page', 'space'] },
  variants: [
    {
      id: 'editor',
      label: 'designs.propertyElements.variants.editor',
      description: 'designs.propertyElements.descriptions.editor',
      renderer: 'editor',
      styleCategory: 'editor',
      editableStyles: [
        'color',
        'title',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
      ],
      editor: true,
    },
    {
      id: 'display',
      label: 'designs.propertyElements.variants.display',
      description: 'designs.propertyElements.descriptions.display',
      renderer: 'formatted-text',
      styleCategory: 'typography',
      editableStyles: [
        'color',
        'textAlign',
        'truncate',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
      ],
    },
  ],
};
