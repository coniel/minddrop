import React, { FC } from 'react';

export const ColorPalette: FC<React.HTMLAttributes<SVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.54 5.0799C18.5374 4.08432 17.346 3.29904 16.0357 2.77014C14.7255 2.24124 13.3228 1.97937 11.91 1.9999C9.25785 1.99327 6.71167 3.04048 4.83162 4.91115C2.95157 6.78183 1.89164 9.32274 1.88501 11.9749C1.87838 14.6271 2.92559 17.1732 4.79627 19.0533C6.66694 20.9333 9.20785 21.9933 11.86 21.9999C12.4315 22.0096 12.99 21.8293 13.448 21.4872C13.9059 21.1451 14.2372 20.6607 14.39 20.1099C14.4874 19.7121 14.4864 19.2967 14.3871 18.8994C14.2878 18.5021 14.0931 18.135 13.82 17.8299C13.7569 17.758 13.7157 17.6696 13.7013 17.575C13.6869 17.4804 13.7 17.3837 13.7389 17.2963C13.7779 17.2089 13.8411 17.1345 13.921 17.082C14.001 17.0295 14.0943 17.001 14.19 16.9999H15.84C17.393 17.0072 18.8912 16.4266 20.0338 15.3749C21.1764 14.3232 21.8788 12.8781 22 11.3299C22.0372 10.1755 21.8382 9.02569 21.4152 7.95096C20.9922 6.87622 20.3541 5.89923 19.54 5.0799ZM15.88 14.9999H14.23C13.7481 14.9972 13.2758 15.1343 12.8704 15.3947C12.4649 15.6551 12.1437 16.0276 11.9457 16.4669C11.7478 16.9063 11.6815 17.3936 11.7551 17.8698C11.8286 18.3461 12.0387 18.7907 12.36 19.1499C12.4226 19.213 12.4668 19.292 12.4879 19.3783C12.5091 19.4646 12.5063 19.555 12.48 19.6399C12.43 19.8499 12.2 19.9799 11.89 19.9999C10.7543 19.9853 9.63477 19.7291 8.6058 19.2483C7.57682 18.7675 6.66202 18.0731 5.92225 17.2113C5.18248 16.3495 4.63469 15.34 4.31532 14.2501C3.99595 13.1601 3.91233 12.0147 4.07001 10.8899C4.35518 8.99985 5.29957 7.27153 6.73615 6.01063C8.17273 4.74974 10.0089 4.0375 11.92 3.9999H12C13.1309 3.98509 14.2532 4.19691 15.3009 4.62284C16.3485 5.04878 17.3003 5.68021 18.1 6.4799C18.724 7.1043 19.2143 7.84925 19.541 8.66934C19.8676 9.48943 20.0238 10.3675 20 11.2499C19.8965 12.273 19.4186 13.2217 18.6581 13.9139C17.8977 14.606 16.9083 14.9928 15.88 14.9999Z"
      fill="inherit"
    />
    <path
      d="M12 8C12.8284 8 13.5 7.32843 13.5 6.5C13.5 5.67157 12.8284 5 12 5C11.1716 5 10.5 5.67157 10.5 6.5C10.5 7.32843 11.1716 8 12 8Z"
      fill="inherit"
    />
    <path
      d="M15.25 7.19992C14.9932 7.34828 14.7861 7.56945 14.6549 7.83548C14.5238 8.1015 14.4744 8.40044 14.5131 8.69451C14.5518 8.98857 14.6768 9.26456 14.8724 9.48759C15.0679 9.71063 15.3251 9.87069 15.6116 9.94754C15.8981 10.0244 16.2009 10.0146 16.4818 9.9194C16.7627 9.82419 17.0091 9.64783 17.1898 9.41263C17.3705 9.17743 17.4774 8.89394 17.497 8.59799C17.5166 8.30204 17.4481 8.00691 17.3 7.74992C17.2016 7.57912 17.0705 7.42939 16.9142 7.3093C16.7578 7.1892 16.5794 7.1011 16.389 7.05001C16.1986 6.99893 16 6.98588 15.8046 7.0116C15.6091 7.03733 15.4207 7.10132 15.25 7.19992Z"
      fill="inherit"
    />
    <path
      d="M8.74999 7.20006C8.493 7.05199 8.19787 6.98342 7.90192 7.00304C7.60597 7.02266 7.32248 7.12957 7.08728 7.31027C6.85207 7.49097 6.67572 7.73735 6.58051 8.01825C6.4853 8.29915 6.47551 8.60198 6.55237 8.88845C6.62922 9.17492 6.78928 9.43217 7.01232 9.6277C7.23535 9.82322 7.51134 9.94823 7.8054 9.98693C8.09947 10.0256 8.39841 9.97629 8.66443 9.84513C8.93046 9.71397 9.15163 9.50689 9.29999 9.25006C9.39859 9.07937 9.46258 8.89092 9.4883 8.69548C9.51403 8.50004 9.50097 8.30145 9.44989 8.11106C9.39881 7.92067 9.31071 7.74222 9.19061 7.5859C9.07052 7.42959 8.92079 7.29847 8.74999 7.20006Z"
      fill="inherit"
    />
    <path
      d="M6.16 11.26C5.91396 11.4262 5.72276 11.6616 5.61059 11.9364C5.49842 12.2113 5.47033 12.5132 5.52988 12.8041C5.58942 13.0949 5.73393 13.3615 5.9451 13.5702C6.15626 13.7788 6.4246 13.9201 6.71612 13.9762C7.00764 14.0323 7.30925 14.0006 7.58274 13.8851C7.85624 13.7696 8.08933 13.5756 8.25249 13.3276C8.41566 13.0796 8.50157 12.7888 8.49935 12.4919C8.49712 12.1951 8.40686 11.9056 8.24 11.66C8.13037 11.4964 7.98939 11.3561 7.8252 11.2473C7.66101 11.1385 7.47688 11.0633 7.28345 11.0261C7.09002 10.9889 6.89113 10.9904 6.6983 11.0306C6.50546 11.0707 6.3225 11.1487 6.16 11.26Z"
      fill="inherit"
    />
  </svg>
);