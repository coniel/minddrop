export type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted';

export interface ContainerStyles {
  gap: number;
  borderStyle: BorderStyle;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  padding?: number;
}

export const DefaultContainerStyles: ContainerStyles = {
  gap: 8,
  borderRadius: 8,
  borderStyle: 'solid',
  borderColor: '#e0e0e0',
  borderWidth: 1,
  padding: 0,
};
