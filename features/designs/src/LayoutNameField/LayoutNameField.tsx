import { useCallback, useEffect, useRef, useState } from 'react';
import { Layout } from '@minddrop/designs';
import { i18n } from '@minddrop/i18n';
import { TextInput } from '@minddrop/ui-primitives';
import { useDesignStudio } from '../DesignStudioStore';
import { layoutTypeNameMap } from '../constants';
import './LayoutNameField.css';

export interface LayoutNameFieldProps {
  /**
   * The layout being named.
   */
  layout: Layout;
}

/**
 * Renders the editable name of the layout being edited, beside the
 * design name in the canvas name bar. Layouts still carrying their
 * type name as a name read as unnamed, leaving the field empty
 * behind its placeholder.
 */
export const LayoutNameField: React.FC<LayoutNameFieldProps> = ({ layout }) => {
  const studio = useDesignStudio();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(() => resolveDraftName(layout));

  // Follow the layout, both when switching layouts and when the
  // name is changed elsewhere
  useEffect(() => {
    setDraft(resolveDraftName(layout));
  }, [layout]);

  // Commit the edited name, falling back to the type name when the
  // field is left blank
  const handleBlur = useCallback(() => {
    const trimmedName = draft.trim() || resolveDefaultName(layout.type);

    setDraft(
      trimmedName === resolveDefaultName(layout.type) ? '' : trimmedName,
    );

    // Nothing to persist when the name is unchanged
    if (trimmedName === layout.name) {
      return;
    }

    studio.renameLayout(layout.id, trimmedName);
  }, [studio, draft, layout.id, layout.name, layout.type]);

  // Enter commits the edit by blurring the input
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        inputRef.current?.blur();
      }
    },
    [],
  );

  return (
    <TextInput
      ref={inputRef}
      className="designs-layout-name-field"
      variant="subtle"
      size="sm"
      value={draft}
      placeholder={layoutTypeNameMap[layout.type]}
      onValueChange={setDraft}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

/**
 * Resolves the name shown in the field, blanking names which are
 * just the layout type's name so the placeholder shows through.
 */
function resolveDraftName(layout: Layout): string {
  if (layout.name === resolveDefaultName(layout.type)) {
    return '';
  }

  return layout.name;
}

/**
 * Resolves the localized name of a layout type, which layouts are
 * named after until they are renamed.
 */
function resolveDefaultName(type: Layout['type']): string {
  return i18n.t(layoutTypeNameMap[type]);
}
