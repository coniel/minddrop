/* eslint-disable no-console */
import React from 'react';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuTriggerItem } from './DropdownMenuTriggerItem';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';
import { IconButton } from '../IconButton';

export default {
  title: 'ui/DropdownMenu',
  component: DropdownMenu,
};

const MoreVertical = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
      fill="inherit"
    />
    <path
      d="M12 7C13.1046 7 14 6.10457 14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5C10 6.10457 10.8954 7 12 7Z"
      fill="inherit"
    />
    <path
      d="M12 21C13.1046 21 14 20.1046 14 19C14 17.8954 13.1046 17 12 17C10.8954 17 10 17.8954 10 19C10 20.1046 10.8954 21 12 21Z"
      fill="inherit"
    />
  </svg>
);

const Title = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V7C21 7.55228 20.5523 8 20 8C19.4477 8 19 7.55228 19 7V5H5V7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7V4Z"
      fill="inherit"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 20C8 19.4477 8.44772 19 9 19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20Z"
      fill="inherit"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3C12.5523 3 13 3.44772 13 4V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V4C11 3.44772 11.4477 3 12 3Z"
      fill="inherit"
    />
  </svg>
);

const TurnInto = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_370:17287)">
      <path
        d="M6.09 5H18.09L16.79 3.71C16.6017 3.5217 16.4959 3.2663 16.4959 3C16.4959 2.7337 16.6017 2.4783 16.79 2.29C16.9783 2.1017 17.2337 1.99591 17.5 1.99591C17.7663 1.99591 18.0217 2.1017 18.21 2.29L21.21 5.29C21.3037 5.38296 21.3781 5.49356 21.4289 5.61542C21.4797 5.73728 21.5058 5.86799 21.5058 6C21.5058 6.13201 21.4797 6.26272 21.4289 6.38458C21.3781 6.50644 21.3037 6.61704 21.21 6.71L18.21 9.71C18.117 9.80373 18.0064 9.87812 17.8846 9.92889C17.7627 9.97966 17.632 10.0058 17.5 10.0058C17.368 10.0058 17.2373 9.97966 17.1154 9.92889C16.9936 9.87812 16.883 9.80373 16.79 9.71C16.6963 9.61704 16.6219 9.50644 16.5711 9.38458C16.5203 9.26272 16.4942 9.13201 16.4942 9C16.4942 8.86799 16.5203 8.73728 16.5711 8.61542C16.6219 8.49356 16.6963 8.38296 16.79 8.29L18.09 7H6.09C5.88513 6.99602 5.68148 7.03245 5.49069 7.10719C5.29989 7.18193 5.1257 7.29353 4.97804 7.43561C4.83039 7.57769 4.71218 7.74747 4.63015 7.93525C4.54813 8.12303 4.5039 8.32513 4.5 8.53V11C4.5 11.2652 4.39464 11.5196 4.20711 11.7071C4.01957 11.8946 3.76522 12 3.5 12C3.23478 12 2.98043 11.8946 2.79289 11.7071C2.60536 11.5196 2.5 11.2652 2.5 11V8.53C2.50392 8.06249 2.59989 7.60033 2.78244 7.16991C2.96498 6.73949 3.23051 6.34924 3.56388 6.02145C3.89724 5.69366 4.29191 5.43473 4.72534 5.25947C5.15878 5.08421 5.62249 4.99604 6.09 5Z"
        fill="inherit"
      />
      <path
        d="M5.79 14.2901C5.9783 14.1018 6.2337 13.996 6.5 13.996C6.7663 13.996 7.0217 14.1018 7.21 14.2901C7.3983 14.4784 7.50409 14.7338 7.50409 15.0001C7.50409 15.2664 7.3983 15.5218 7.21 15.7101L5.91 17.0001H17.91C18.1149 17.004 18.3185 16.9676 18.5093 16.8929C18.7001 16.8181 18.8743 16.7065 19.022 16.5644C19.1696 16.4224 19.2878 16.2526 19.3698 16.0648C19.4519 15.877 19.4961 15.6749 19.5 15.4701V13.0001C19.5 12.7348 19.6054 12.4805 19.7929 12.293C19.9804 12.1054 20.2348 12.0001 20.5 12.0001C20.7652 12.0001 21.0196 12.1054 21.2071 12.293C21.3946 12.4805 21.5 12.7348 21.5 13.0001V15.4701C21.4961 15.9376 21.4001 16.3997 21.2176 16.8302C21.035 17.2606 20.7695 17.6508 20.4361 17.9786C20.1028 18.3064 19.7081 18.5653 19.2747 18.7406C18.8412 18.9158 18.3775 19.004 17.91 19.0001H5.91L7.21 20.2901C7.30373 20.383 7.37812 20.4936 7.42889 20.6155C7.47966 20.7373 7.5058 20.868 7.5058 21.0001C7.5058 21.1321 7.47966 21.2628 7.42889 21.3846C7.37812 21.5065 7.30373 21.6171 7.21 21.7101C7.11704 21.8038 7.00644 21.8782 6.88458 21.929C6.76272 21.9797 6.63201 22.0059 6.5 22.0059C6.36799 22.0059 6.23728 21.9797 6.11542 21.929C5.99356 21.8782 5.88296 21.8038 5.79 21.7101L2.79 18.7101C2.69627 18.6171 2.62188 18.5065 2.57111 18.3846C2.52034 18.2628 2.4942 18.1321 2.4942 18.0001C2.4942 17.868 2.52034 17.7373 2.57111 17.6155C2.62188 17.4936 2.69627 17.383 2.79 17.2901L5.79 14.2901Z"
        fill="inherit"
      />
    </g>
    <defs>
      <clipPath id="clip0_370:17287">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="matrix(1 0 0 -1 0 24)"
        />
      </clipPath>
    </defs>
  </svg>
);

const Note = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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

const MoveTo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 7.05C18 6.78478 17.8946 6.53043 17.7071 6.34289C17.5196 6.15536 17.2652 6.05 17 6.05L9 6C8.73478 6 8.48043 6.10536 8.29289 6.29289C8.10536 6.48043 8 6.73478 8 7C8 7.26522 8.10536 7.51957 8.29289 7.70711C8.48043 7.89464 8.73478 8 9 8H14.56L6.29 16.29C6.19627 16.383 6.12188 16.4936 6.07111 16.6154C6.02034 16.7373 5.9942 16.868 5.9942 17C5.9942 17.132 6.02034 17.2627 6.07111 17.3846C6.12188 17.5064 6.19627 17.617 6.29 17.71C6.38296 17.8037 6.49356 17.8781 6.61542 17.9289C6.73728 17.9797 6.86799 18.0058 7 18.0058C7.13201 18.0058 7.26272 17.9797 7.38458 17.9289C7.50644 17.8781 7.61704 17.8037 7.71 17.71L16 9.42V15C16 15.2652 16.1054 15.5196 16.2929 15.7071C16.4804 15.8946 16.7348 16 17 16C17.2652 16 17.5196 15.8946 17.7071 15.7071C17.8946 15.5196 18 15.2652 18 15V7.05Z"
      fill="inherit"
    />
  </svg>
);

const Link = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.29 9.28994L9.29 13.2899C9.19627 13.3829 9.12188 13.4935 9.07111 13.6154C9.02034 13.7372 8.9942 13.8679 8.9942 13.9999C8.9942 14.132 9.02034 14.2627 9.07111 14.3845C9.12188 14.5064 9.19627 14.617 9.29 14.7099C9.38296 14.8037 9.49356 14.8781 9.61542 14.9288C9.73728 14.9796 9.86799 15.0057 10 15.0057C10.132 15.0057 10.2627 14.9796 10.3846 14.9288C10.5064 14.8781 10.617 14.8037 10.71 14.7099L14.71 10.7099C14.8983 10.5216 15.0041 10.2662 15.0041 9.99994C15.0041 9.73364 14.8983 9.47824 14.71 9.28994C14.5217 9.10164 14.2663 8.99585 14 8.99585C13.7337 8.99585 13.4783 9.10164 13.29 9.28994Z"
      fill="inherit"
    />
    <path
      d="M12.28 17.3999L11 18.6699C10.2814 19.4104 9.31544 19.8604 8.28629 19.9342C7.25714 20.0079 6.23684 19.7003 5.42 19.0699C4.98827 18.7142 4.63597 18.2718 4.38584 17.7714C4.13571 17.271 3.99333 16.7238 3.96788 16.1649C3.94244 15.6061 4.0345 15.0481 4.23812 14.5271C4.44174 14.006 4.75239 13.5335 5.15 13.1399L6.57 11.7099C6.66373 11.617 6.73812 11.5064 6.78889 11.3845C6.83966 11.2627 6.8658 11.132 6.8658 10.9999C6.8658 10.8679 6.83966 10.7372 6.78889 10.6154C6.73812 10.4935 6.66373 10.3829 6.57 10.2899C6.47704 10.1962 6.36644 10.1218 6.24458 10.071C6.12272 10.0203 5.99201 9.99414 5.86 9.99414C5.72799 9.99414 5.59728 10.0203 5.47542 10.071C5.35356 10.1218 5.24296 10.1962 5.15 10.2899L3.88 11.5699C2.81016 12.6059 2.15259 13.995 2.02937 15.4791C1.90615 16.9633 2.32565 18.4417 3.21 19.6399C3.73488 20.3209 4.39864 20.8823 5.15719 21.287C5.91574 21.6917 6.75171 21.9303 7.60958 21.9871C8.46745 22.0438 9.32757 21.9174 10.1328 21.6161C10.9381 21.3149 11.67 20.8458 12.28 20.2399L13.7 18.8199C13.8883 18.6316 13.9941 18.3762 13.9941 18.1099C13.9941 17.8436 13.8883 17.5882 13.7 17.3999C13.5117 17.2116 13.2563 17.1058 12.99 17.1058C12.7237 17.1058 12.4683 17.2116 12.28 17.3999Z"
      fill="inherit"
    />
    <path
      d="M19.66 3.22004C18.4535 2.3265 16.963 1.90272 15.4668 2.02786C13.9707 2.153 12.5713 2.81849 11.53 3.90004L10.45 5.00004C10.3265 5.08977 10.2233 5.20443 10.147 5.33659C10.0707 5.46875 10.023 5.61546 10.0069 5.76723C9.99092 5.919 10.0069 6.07244 10.054 6.21763C10.101 6.36281 10.178 6.4965 10.28 6.61004C10.3729 6.70377 10.4835 6.77816 10.6054 6.82893C10.7273 6.8797 10.858 6.90584 10.99 6.90584C11.122 6.90584 11.2527 6.8797 11.3746 6.82893C11.4964 6.77816 11.607 6.70377 11.7 6.61004L13 5.30004C13.7146 4.55635 14.6794 4.10387 15.7081 4.03C16.7369 3.95612 17.7565 4.26609 18.57 4.90004C19.0049 5.25584 19.36 5.69929 19.6121 6.2015C19.8643 6.70371 20.0077 7.25341 20.0332 7.81477C20.0587 8.37613 19.9656 8.93655 19.76 9.45953C19.5544 9.98251 19.2409 10.4563 18.84 10.85L17.42 12.28C17.3263 12.373 17.2519 12.4836 17.2011 12.6055C17.1503 12.7273 17.1242 12.858 17.1242 12.99C17.1242 13.122 17.1503 13.2528 17.2011 13.3746C17.2519 13.4965 17.3263 13.6071 17.42 13.7C17.5129 13.7938 17.6236 13.8682 17.7454 13.9189C17.8673 13.9697 17.998 13.9958 18.13 13.9958C18.262 13.9958 18.3927 13.9697 18.5146 13.9189C18.6364 13.8682 18.747 13.7938 18.84 13.7L20.26 12.28C20.8641 11.6701 21.3318 10.9388 21.632 10.1346C21.9323 9.33031 22.0582 8.47144 22.0015 7.61484C21.9447 6.75824 21.7066 5.92348 21.303 5.16583C20.8993 4.40818 20.3393 3.74494 19.66 3.22004Z"
      fill="inherit"
    />
  </svg>
);

const AddTo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.78 12.38L15.78 7.38C15.608 7.19782 15.3739 7.08682 15.1241 7.06897C14.8742 7.05112 14.6267 7.12771 14.4306 7.2836C14.2344 7.43949 14.104 7.66332 14.065 7.91079C14.026 8.15827 14.0813 8.41136 14.22 8.62L16.92 12H8C7.73478 12 7.48043 11.8946 7.29289 11.7071C7.10536 11.5196 7 11.2652 7 11V6C7 5.73478 6.89464 5.48043 6.70711 5.29289C6.51957 5.10536 6.26522 5 6 5C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V11C5 11.7956 5.31607 12.5587 5.87868 13.1213C6.44129 13.6839 7.20435 14 8 14H16.92L14.22 17.38C14.0565 17.5872 13.9816 17.8507 14.0115 18.113C14.0415 18.3752 14.174 18.615 14.38 18.78C14.5559 18.9212 14.7744 18.9987 15 19C15.1502 18.9993 15.2983 18.9648 15.4334 18.899C15.5684 18.8332 15.6869 18.7379 15.78 18.62L19.78 13.62C19.9195 13.4435 19.9954 13.225 19.9954 13C19.9954 12.775 19.9195 12.5565 19.78 12.38Z"
      fill="inherit"
    />
  </svg>
);

export const GeneratedFromContentProp: React.FC = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <IconButton label="Drop options">
        <MoreVertical />
      </IconButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      style={{ width: 240 }}
      content={[
        {
          label: 'Add title',
          icon: <Title />,
          onSelect: () => console.log('Add title'),
          keyboardShortcut: ['Ctrl', 'T'],
        },
        {
          label: 'Add note',
          icon: <Note />,
          onSelect: () => console.log('Add note'),
          keyboardShortcut: ['Ctrl', 'Shift', 'N'],
        },
        {
          label: 'Turn into',
          icon: <TurnInto />,
          submenu: [
            {
              label: 'Text',
              onSelect: () => console.log('Turn into text'),
            },
            {
              label: 'Image',
              onSelect: () => console.log('Turn into image'),
            },
            {
              label: 'Equation',
              onSelect: () => console.log('Turn into equation'),
            },
          ],
        },
        '---',
        'Actions',
        {
          label: 'Copy link',
          icon: <Link />,
          onSelect: () => console.log('Copy link'),
          keyboardShortcut: ['Ctrl', 'Shift', 'C'],
        },
        {
          label: 'Move to',
          icon: <MoveTo />,
          onSelect: () => console.log('Move to'),
          keyboardShortcut: ['Ctrl', 'M'],
          tooltipTitle: 'Move drop to another topic',
        },
        {
          label: 'Add to',
          icon: <AddTo />,
          onSelect: () => console.log('Add to'),
          keyboardShortcut: ['Ctrl', 'A'],
          tooltipTitle: 'Add drop to another topic',
          tooltipDescription:
            'Drops appearing in multiple topics are kept in sync.',
        },
      ]}
    />
  </DropdownMenu>
);

export const ComposedWithComponents: React.FC = () => (
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label="Drop options">
          <MoreVertical />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ width: 240 }}>
        <DropdownMenuItem
          label="Add title"
          icon={<Title />}
          keyboardShortcut={['Ctrl', 'T']}
          onSelect={() => console.log('Add title')}
        />
        <DropdownMenuItem
          label="Add note"
          icon={<Note />}
          keyboardShortcut={['Ctrl', 'Shift', 'N']}
          onSelect={() => console.log('Add note')}
        />
        <DropdownMenu>
          <DropdownMenuTriggerItem label="Turn into" icon={<TurnInto />} />
          <DropdownMenuContent>
            <DropdownMenuItem
              label="Text"
              onSelect={() => console.log('Turn into text')}
            />
            <DropdownMenuItem
              label="Image"
              onSelect={() => console.log('Turn into image')}
            />
            <DropdownMenuItem
              label="Equation"
              onSelect={() => console.log('Turn into equation')}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          label="Copy link"
          icon={<Link />}
          keyboardShortcut={['Ctrl', 'Shift', 'C']}
          onSelect={() => console.log('Copy link')}
        />
        <DropdownMenuItem
          label="Move to"
          icon={<MoveTo />}
          keyboardShortcut={['Ctrl', 'M']}
          onSelect={() => console.log('Move to')}
          tooltipTitle="Move drop to another topic"
        />
        <DropdownMenuItem
          label="Add to"
          icon={<AddTo />}
          keyboardShortcut={['Ctrl', 'A']}
          onSelect={() => console.log('Add to')}
          tooltipTitle="Add drop to another topic"
          tooltipDescription="Drops appearing in multiple topics are kept in sync."
        />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
