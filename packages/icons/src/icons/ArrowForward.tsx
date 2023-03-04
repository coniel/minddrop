import React, { FC } from 'react';

export const ArrowForward: FC<React.HTMLAttributes<SVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 13H16.86L13.23 17.36C13.146 17.4611 13.0826 17.5778 13.0437 17.7034C13.0047 17.829 12.9909 17.961 13.003 18.0919C13.0274 18.3564 13.1558 18.6003 13.36 18.77C13.5642 18.9397 13.8275 19.0214 14.0919 18.997C14.3563 18.9726 14.6003 18.8442 14.77 18.64L19.77 12.64C19.8036 12.5923 19.8337 12.5421 19.86 12.49C19.86 12.44 19.91 12.41 19.93 12.36C19.9753 12.2453 19.9991 12.1233 20 12C19.9991 11.8767 19.9753 11.7547 19.93 11.64C19.93 11.59 19.88 11.56 19.86 11.51C19.8337 11.4579 19.8036 11.4077 19.77 11.36L14.77 5.36C14.676 5.24712 14.5582 5.15634 14.4252 5.09412C14.2921 5.0319 14.1469 4.99976 14 5C13.7663 4.99955 13.5399 5.08092 13.36 5.23C13.2587 5.31395 13.175 5.41705 13.1137 5.5334C13.0523 5.64975 13.0145 5.77705 13.0025 5.90803C12.9904 6.03901 13.0043 6.17108 13.0433 6.29668C13.0824 6.42229 13.1458 6.53895 13.23 6.64L16.86 11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13Z"
      fill="inherit"
    />
  </svg>
);
