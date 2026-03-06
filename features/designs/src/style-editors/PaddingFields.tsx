import { SpacingFields } from './SpacingFields';

export interface PaddingFieldsProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

const sides = [
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
] as const;

/**
 * Renders four padding fields arranged in a cross layout with a sync toggle.
 */
export const PaddingFields = ({ elementId }: PaddingFieldsProps) => {
  return (
    <SpacingFields
      elementId={elementId}
      sides={sides}
      syncLabel="designs.padding.sync"
      min={0}
      max={100}
    />
  );
};
