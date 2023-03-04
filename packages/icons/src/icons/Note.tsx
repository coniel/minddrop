import React, { FC } from 'react';

export const Note: FC<React.HTMLAttributes<SVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 9C2 8.44772 2.44772 8 3 8H17C17.5523 8 18 8.44772 18 9C18 9.55228 17.5523 10 17 10H3C2.44772 10 2 9.55228 2 9Z"
      fill="inherit"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4C22 4.55228 21.5523 5 21 5H3C2.44772 5 2 4.55228 2 4Z"
      fill="inherit"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 14C2 13.4477 2.44772 13 3 13H21C21.5523 13 22 13.4477 22 14C22 14.5523 21.5523 15 21 15H3C2.44772 15 2 14.5523 2 14Z"
      fill="inherit"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 19C2 18.4477 2.44772 18 3 18H17C17.5523 18 18 18.4477 18 19C18 19.5523 17.5523 20 17 20H3C2.44772 20 2 19.5523 2 19Z"
      fill="inherit"
    />
  </svg>
);
