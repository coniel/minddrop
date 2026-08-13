import { CardinalFields } from './CardinalFields';

export interface MarginFieldsProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

const sides = [
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
] as const;

/**
 * Renders four margin fields arranged in a cross layout with a sync toggle.
 */
export const MarginFields = ({ elementId }: MarginFieldsProps) => {
  return (
    <CardinalFields
      elementId={elementId}
      sides={sides}
      syncLabel="designs.typography.margin.sync"
    />
  );
};
