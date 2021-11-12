import React, { useState } from 'react';
import { ToggleFilled } from '@minddrop/icons';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './Collapsible';

export default {
  title: 'ui/Collapsible',
  component: Collapsible,
};

const NavItem = ({ children, subItem = false, ...other }) => (
  <div
    role="button"
    {...other}
    style={{
      width: 200,
      height: 28,
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      marginBottom: 6,
      backgroundColor: 'var(--bgSubtle)',
      paddingLeft: subItem ? 30 : 6,
      cursor: 'pointer',
      userSelect: 'none',
    }}
  >
    {children}
  </div>
);

export const Default = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          <NavItem>
            <span>
              <ToggleFilled
                style={{
                  fill: 'var(--textPrimary)',
                  transform: open ? 'rotate(90deg)' : 'none',
                }}
              />
            </span>
            Books
          </NavItem>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <NavItem subItem>The book of tea</NavItem>
          <NavItem subItem>All the tea in China</NavItem>
          <NavItem subItem>Tea: A User&apos;s Guide</NavItem>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
