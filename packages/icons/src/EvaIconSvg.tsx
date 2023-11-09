export interface EvaIconSvgProps extends React.HTMLProps<SVGSVGElement> {
  /**
   * The icon content.
   */
  children: React.ReactNode;
}

export const EvaIconSvg: React.FC<EvaIconSvgProps> = ({
  children,
  ...other
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      {children}
    </svg>
  );
};
