import {
  DesignElementConfig,
  Designs,
  FontWeight,
} from '@minddrop/designs-next';
import { resolveElementLineRowSpan } from '../../../utils';
import { EditorTitleElement } from '../EditorTitleElement.types';

export const EditorTitleElementType = 'editor-title';

// The size and weight a new title is set in
const DefaultTitleFontSize = 32;
const DefaultTitleFontWeight: FontWeight = 600;

/**
 * Config for the editor title element: the title of the document an
 * editor renders, filling the editor's title slot. It has no group
 * and no component, being reachable only through that slot and
 * rendered by the editor holding it. It takes a title or text
 * property and no static content, a title being the entry's rather
 * than the design's.
 */
export const EditorTitleElementConfig: DesignElementConfig<EditorTitleElement> =
  {
    type: EditorTitleElementType,
    label: 'designsNext.elements.editorTitle.label',
    icon: 'type',
    propertyTypes: ['title', 'text'],
    suggestedPropertyTypes: ['title'],
    defaultColumnSpan: Designs.constants.TypeColumns.card,
    defaultRowSpan: Designs.resolveTextLineRowSpan(DefaultTitleFontSize),
    resolveDefaults: resolveTitleDefaults,
    settingControls: [
      'font',
      'font-size',
      'line-height',
      'font-weight',
      'text-align',
      'text-color',
    ],
    resolveMinRowSpan: resolveElementLineRowSpan,
  };

/**
 * Resolves the fields a new title starts with: the size and weight
 * setting it apart from the document below it.
 *
 * @returns The starter fields.
 */
function resolveTitleDefaults(): Partial<EditorTitleElement> {
  return {
    fontSize: DefaultTitleFontSize,
    fontWeight: DefaultTitleFontWeight,
  };
}
