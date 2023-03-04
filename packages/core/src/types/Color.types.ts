type AllContentColors =
  | 'default'
  | 'blue'
  | 'cyan'
  | 'red'
  | 'pink'
  | 'purple'
  | 'green'
  | 'orange'
  | 'yellow'
  | 'brown'
  | 'gray';

export type ContentColor<TColor = AllContentColors> = Extract<
  AllContentColors,
  TColor
>;
