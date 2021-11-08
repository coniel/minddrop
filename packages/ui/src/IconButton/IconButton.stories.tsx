import React from 'react';
import { IconButton } from './IconButton';
import { Text } from '../Text';

export default {
  title: 'ui/IconButton',
  component: IconButton,
};

const Settings = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.61 22C8.12202 21.9971 7.64821 21.8357 7.26 21.54L5.19 20C4.71231 19.6276 4.39536 19.0863 4.30423 18.4875C4.2131 17.8887 4.35472 17.2777 4.7 16.78C4.88269 16.5102 4.99879 16.201 5.03877 15.8777C5.07876 15.5543 5.04148 15.2261 4.93 14.92L4.87 14.76C4.79238 14.4829 4.65051 14.228 4.45591 14.0161C4.26131 13.8041 4.01946 13.641 3.75 13.54H3.59C3.00587 13.3436 2.52281 12.9247 2.24571 12.3742C1.96861 11.8237 1.91984 11.1862 2.11 10.6L2.93 8C3.00548 7.69876 3.14446 7.41713 3.33762 7.17396C3.53077 6.93078 3.77366 6.73169 4.05 6.59C4.30735 6.4574 4.58893 6.3784 4.8777 6.35777C5.16647 6.33715 5.45642 6.37533 5.73 6.47C6.02788 6.57025 6.34575 6.59624 6.65596 6.5457C6.96617 6.49516 7.25934 6.36962 7.51 6.18L7.64 6.08C7.8669 5.89895 8.05027 5.6693 8.17661 5.40796C8.30295 5.14663 8.36904 4.86027 8.37 4.57V4.33C8.36731 3.71813 8.60645 3.12997 9.03535 2.69358C9.46425 2.25719 10.0482 2.00791 10.66 2H13.21C13.5077 2.0008 13.8023 2.0604 14.0768 2.17538C14.3514 2.29036 14.6006 2.45845 14.81 2.67C15.2503 3.11779 15.4949 3.72202 15.49 4.35V4.63C15.4849 4.90575 15.5447 5.17884 15.6646 5.42723C15.7844 5.67562 15.961 5.89237 16.18 6.06L16.29 6.14C16.5144 6.3083 16.7762 6.41984 17.0531 6.46511C17.3299 6.51039 17.6136 6.48805 17.88 6.4L18.22 6.29C18.5081 6.19451 18.8124 6.15802 19.1149 6.1827C19.4174 6.20737 19.7118 6.29272 19.9805 6.43364C20.2493 6.57456 20.487 6.76817 20.6793 7.00292C20.8716 7.23767 21.0147 7.50876 21.1 7.8L21.89 10.32C22.0728 10.9024 22.0228 11.533 21.7506 12.0793C21.4784 12.6256 21.005 13.0452 20.43 13.25L20.23 13.32C19.9358 13.4163 19.6698 13.5834 19.4554 13.8066C19.2409 14.0298 19.0845 14.3022 19 14.6C18.9204 14.8768 18.9015 15.1675 18.9447 15.4523C18.9878 15.7371 19.092 16.0092 19.25 16.25L19.51 16.63C19.8548 17.1304 19.9951 17.7438 19.9021 18.3444C19.8092 18.945 19.49 19.4872 19.01 19.86L17 21.41C16.7572 21.5957 16.4789 21.7297 16.1823 21.8039C15.8857 21.878 15.5771 21.8906 15.2755 21.8409C14.9738 21.7913 14.6855 21.6804 14.4283 21.5152C14.1711 21.3499 13.9505 21.1337 13.78 20.88L13.66 20.71C13.4962 20.4639 13.2727 20.2632 13.0104 20.1268C12.7481 19.9904 12.4556 19.9227 12.16 19.93C11.878 19.9373 11.6016 20.0108 11.3532 20.1445C11.1048 20.2783 10.8913 20.4686 10.73 20.7L10.5 21.03C10.3294 21.2855 10.1084 21.5034 9.85039 21.6702C9.59241 21.8371 9.303 21.9493 9 22C8.87031 22.0127 8.73969 22.0127 8.61 22ZM4.4 11.62C4.96469 11.8214 5.47423 12.1525 5.8876 12.5867C6.30097 13.0209 6.60664 13.5461 6.78 14.12V14.24C6.99593 14.8366 7.06684 15.4761 6.98685 16.1055C6.90687 16.735 6.67829 17.3363 6.32 17.86C6.25676 17.9299 6.22174 18.0208 6.22174 18.115C6.22174 18.2092 6.25676 18.3001 6.32 18.37L8.47 20C8.49805 20.022 8.53049 20.0378 8.56514 20.0463C8.59979 20.0547 8.63585 20.0557 8.6709 20.049C8.70595 20.0424 8.73917 20.0284 8.76834 20.0078C8.7975 19.9873 8.82194 19.9608 8.84 19.93L9.07 19.6C9.41689 19.0988 9.88014 18.6891 10.4201 18.4062C10.96 18.1232 11.5604 17.9754 12.17 17.9754C12.7796 17.9754 13.38 18.1232 13.9199 18.4062C14.4599 18.6891 14.9231 19.0988 15.27 19.6L15.39 19.78C15.433 19.841 15.4972 19.8838 15.57 19.9C15.6034 19.9049 15.6375 19.903 15.6701 19.8944C15.7028 19.8859 15.7333 19.8707 15.76 19.85L17.82 18.29C17.8921 18.2328 17.9396 18.1501 17.9526 18.0589C17.9656 17.9678 17.9432 17.8751 17.89 17.8L17.63 17.42C17.2912 16.926 17.0677 16.3622 16.976 15.7703C16.8843 15.1783 16.9266 14.5734 17.1 14C17.2757 13.3974 17.5936 12.8458 18.0269 12.3916C18.4603 11.9374 18.9963 11.5939 19.59 11.39L19.79 11.32C19.8734 11.2866 19.9401 11.2216 19.9757 11.1392C20.0113 11.0567 20.0128 10.9636 19.98 10.88L19.2 8.39C19.1813 8.34643 19.1539 8.30713 19.1195 8.27446C19.0851 8.2418 19.0445 8.21647 19 8.2C18.9706 8.18507 18.938 8.17728 18.905 8.17728C18.872 8.17728 18.8394 8.18507 18.81 8.2L18.47 8.31C17.8948 8.49982 17.2822 8.54712 16.6847 8.44783C16.0873 8.34855 15.5228 8.10564 15.04 7.74L15 7.65C14.5367 7.29912 14.161 6.84561 13.9025 6.32509C13.6439 5.80456 13.5096 5.23119 13.51 4.65V4.34C13.5118 4.24362 13.4759 4.15033 13.41 4.08C13.3525 4.02801 13.2775 3.99946 13.2 4H10.66C10.6193 4.00254 10.5794 4.01311 10.5428 4.03109C10.5061 4.04906 10.4734 4.0741 10.4465 4.10476C10.4195 4.13542 10.3989 4.1711 10.3858 4.20976C10.3726 4.24841 10.3673 4.28927 10.37 4.33V4.58C10.3701 5.17704 10.233 5.76612 9.96952 6.30185C9.70599 6.83758 9.32298 7.30565 8.85 7.67L8.72 7.77C8.20973 8.15851 7.61173 8.41553 6.9787 8.51842C6.34567 8.62131 5.69705 8.5669 5.09 8.36C5.04458 8.34476 4.99542 8.34476 4.95 8.36C4.89356 8.39429 4.85106 8.44741 4.83 8.51L4 11.12C3.97107 11.2089 3.97785 11.3056 4.01891 11.3895C4.05996 11.4735 4.13208 11.5382 4.22 11.57L4.4 11.62Z"
      fill="inherit"
    />
    <path
      d="M12 15.5C11.3078 15.5 10.6311 15.2947 10.0555 14.9101C9.47993 14.5256 9.03133 13.9789 8.76642 13.3394C8.50151 12.6999 8.4322 11.9961 8.56725 11.3172C8.7023 10.6383 9.03564 10.0146 9.52513 9.52513C10.0146 9.03564 10.6382 8.7023 11.3172 8.56725C11.9961 8.4322 12.6999 8.50152 13.3394 8.76642C13.9789 9.03133 14.5256 9.47993 14.9101 10.0555C15.2947 10.6311 15.5 11.3078 15.5 12C15.5 12.9283 15.1313 13.8185 14.4749 14.4749C13.8185 15.1313 12.9283 15.5 12 15.5ZM12 10.5C11.7033 10.5 11.4133 10.588 11.1666 10.7528C10.92 10.9176 10.7277 11.1519 10.6142 11.426C10.5006 11.7001 10.4709 12.0017 10.5288 12.2926C10.5867 12.5836 10.7296 12.8509 10.9393 13.0607C11.1491 13.2704 11.4164 13.4133 11.7074 13.4712C11.9983 13.5291 12.2999 13.4994 12.574 13.3858C12.8481 13.2723 13.0824 13.08 13.2472 12.8334C13.412 12.5867 13.5 12.2967 13.5 12C13.5 11.6022 13.342 11.2206 13.0607 10.9393C12.7794 10.658 12.3978 10.5 12 10.5Z"
      fill="inherit"
    />
  </svg>
);

export const Default: React.FC = () => (
  <div>
    <Text size="large" color="light" weight="semibold" component="div">
      Sizes
    </Text>
    <IconButton label="settings">
      <Settings />
    </IconButton>
    <IconButton size="small" label="settings">
      <Settings />
    </IconButton>

    <Text
      size="large"
      color="light"
      weight="semibold"
      component="div"
      style={{ marginTop: 20 }}
    >
      Colors
    </Text>
    <IconButton label="settings">
      <Settings />
    </IconButton>
    <IconButton color="light" label="settings">
      <Settings />
    </IconButton>
    <span
      style={{ backgroundColor: 'hsl(195 7.1% 11%)', display: 'inline-block' }}
    >
      <IconButton color="contrast" label="settings">
        <Settings />
      </IconButton>
    </span>

    <Text
      size="large"
      color="light"
      weight="semibold"
      component="div"
      style={{ marginTop: 20 }}
    >
      Disabled
    </Text>
    <IconButton disabled label="settings">
      <Settings />
    </IconButton>
    <IconButton disabled color="light" label="settings">
      <Settings />
    </IconButton>
    <span
      style={{ backgroundColor: 'hsl(195 7.1% 11%)', display: 'inline-block' }}
    >
      <IconButton disabled color="contrast" label="settings">
        <Settings />
      </IconButton>
    </span>
  </div>
);
