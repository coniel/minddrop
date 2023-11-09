export interface LucidIconSvgProps extends React.HTMLProps<SVGSVGElement> {
  /**
   * The icon content.
   */
  children: React.ReactNode;
}

export const LucideIconSvg: React.FC<LucidIconSvgProps> = ({
  children,
  ...other
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...other}
    >
      {children}
    </svg>
  );
};
