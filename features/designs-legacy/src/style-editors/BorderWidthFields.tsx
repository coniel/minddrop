import { CardinalFields } from './CardinalFields';

export interface BorderWidthFieldsProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

const sides = [
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
] as const;

/**
 * Renders four border width fields arranged in a cross layout with a sync toggle.
 */
export const BorderWidthFields = ({ elementId }: BorderWidthFieldsProps) => {
  return (
    <CardinalFields
      elementId={elementId}
      sides={sides}
      syncLabel="designs.border.width.sync"
      remValues={false}
      min={0}
      max={20}
    />
  );
};
