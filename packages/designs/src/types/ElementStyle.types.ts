export interface ElementStyle {
  'background-color'?: string;
  color?: string;
  'font-size'?: string;
  'font-weight'?: number;
  'line-height'?: string;
  padding?: string;
  margin?: string;
  'border-radius'?: string;
  'border-width'?: string;
  'border-color'?: string;
  'box-shadow'?: string;
  'flex-direction'?: 'row' | 'column';
  'flex-wrap'?: 'wrap' | 'nowrap';
  'align-items'?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  'justify-content'?: 'flex-start' | 'flex-end' | 'center' | 'space-between';
  'column-gap'?: string;
  'row-gap'?: string;
  display?: 'flex' | 'grid';
}
