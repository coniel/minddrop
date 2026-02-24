/**
 * Combobox.stories.tsx
 * Dev reference for the Combobox component.
 */

import { useState } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxSeparator,
  ComboboxLabel,
  ComboboxGroup,
  ComboboxEmpty,
} from './Combobox';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

const FRUITS = [
  'Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry',
  'Grape', 'Kiwi', 'Lemon', 'Mango', 'Orange',
  'Peach', 'Pear', 'Pineapple', 'Plum', 'Strawberry',
];

const COUNTRIES = {
  Europe: ['France', 'Germany', 'Italy', 'Spain', 'Sweden'],
  Americas: ['Brazil', 'Canada', 'Mexico', 'United States'],
  Asia: ['China', 'India', 'Japan', 'South Korea'],
};

export const ComboboxStories = () => {
  const [value, setValue] = useState<string[]>([]);
  const [singleValue, setSingleValue] = useState<string[]>([]);

  return (
    <Story title="Combobox">

      {/* --------------------------------------------------------
          BASIC
          Input filters the list as you type. Popup uses the
          same Menu panel styling as DropdownMenu/ContextMenu.
      -------------------------------------------------------- */}
      <StorySection
        title="Basic"
        description="Type to filter items. Input uses TextField outline/md styles. Popup reuses Menu panel styling."
      >
        <StoryRow>
          <StoryItem label="basic">
            <div style={{ width: 240 }}>
              <Combobox>
                <ComboboxInput placeholder="Search fruits..." />
                <ComboboxPortal>
                  <ComboboxPositioner sideOffset={4}>
                    <ComboboxPopup>
                      <ComboboxList>
                        {FRUITS.map((fruit) => (
                          <ComboboxItem key={fruit} value={fruit} label={fruit} />
                        ))}
                      </ComboboxList>
                    </ComboboxPopup>
                  </ComboboxPositioner>
                </ComboboxPortal>
              </Combobox>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          ITEM INDICATOR
          Shows a checkmark on selected items.
          Uses CheckIcon by default; accepts children for custom.
      -------------------------------------------------------- */}
      <StorySection
        title="Item indicator"
        description="ComboboxItemIndicator shows alongside each item. Uses the built-in CheckIcon by default."
      >
        <StoryRow>
          <StoryItem label="with indicator">
            <div style={{ width: 240 }}>
              <Combobox
                value={singleValue}
                onValueChange={setSingleValue}
              >
                <ComboboxInput placeholder="Search fruits..." />
                <ComboboxPortal>
                  <ComboboxPositioner sideOffset={4}>
                    <ComboboxPopup>
                      <ComboboxList>
                        {FRUITS.slice(0, 8).map((fruit) => (
                          <ComboboxItem key={fruit} value={fruit} label={fruit}>
                            <ComboboxItemIndicator />
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxPopup>
                  </ComboboxPositioner>
                </ComboboxPortal>
              </Combobox>
            </div>
          </StoryItem>
          <StoryItem label="custom indicator">
            <div style={{ width: 240 }}>
              <Combobox>
                <ComboboxInput placeholder="Search fruits..." />
                <ComboboxPortal>
                  <ComboboxPositioner sideOffset={4}>
                    <ComboboxPopup>
                      <ComboboxList>
                        {FRUITS.slice(0, 8).map((fruit) => (
                          <ComboboxItem key={fruit} value={fruit} label={fruit}>
                            <ComboboxItemIndicator>
                              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>✓</span>
                            </ComboboxItemIndicator>
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxPopup>
                  </ComboboxPositioner>
                </ComboboxPortal>
              </Combobox>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          GROUPS + LABELS
      -------------------------------------------------------- */}
      <StorySection
        title="Groups and labels"
        description="ComboboxGroup with a label prop groups items with a section heading."
      >
        <StoryRow>
          <StoryItem label="grouped">
            <div style={{ width: 240 }}>
              <Combobox>
                <ComboboxInput placeholder="Search countries..." />
                <ComboboxPortal>
                  <ComboboxPositioner sideOffset={4}>
                    <ComboboxPopup minWidth={240}>
                      <ComboboxList>
                        {Object.entries(COUNTRIES).map(([region, countries], i) => (
                          <ComboboxGroup key={region} label={region}>
                            {countries.map((country) => (
                              <ComboboxItem
                                key={country}
                                value={country}
                                label={country}
                              />
                            ))}
                            {i < Object.keys(COUNTRIES).length - 1 && (
                              <ComboboxSeparator />
                            )}
                          </ComboboxGroup>
                        ))}
                      </ComboboxList>
                    </ComboboxPopup>
                  </ComboboxPositioner>
                </ComboboxPortal>
              </Combobox>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          EMPTY STATE
      -------------------------------------------------------- */}
      <StorySection
        title="Empty state"
        description="ComboboxEmpty renders when no items match. Type something with no match to see it."
      >
        <StoryRow>
          <StoryItem label="with empty state">
            <div style={{ width: 240 }}>
              <Combobox>
                <ComboboxInput placeholder="Try typing 'xyz'..." />
                <ComboboxPortal>
                  <ComboboxPositioner sideOffset={4}>
                    <ComboboxPopup>
                      <ComboboxList>
                        {FRUITS.map((fruit) => (
                          <ComboboxItem key={fruit} value={fruit} label={fruit} />
                        ))}
                      </ComboboxList>
                      <ComboboxEmpty message="No matching fruits." />
                    </ComboboxPopup>
                  </ComboboxPositioner>
                </ComboboxPortal>
              </Combobox>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          MULTIPLE SELECTION
      -------------------------------------------------------- */}
      <StorySection
        title="Multiple selection"
        description="Pass multiple to allow selecting more than one value."
      >
        <StoryRow>
          <StoryItem label={`selected: ${value.join(', ') || 'none'}`}>
            <div style={{ width: 240 }}>
              <Combobox
                multiple
                value={value}
                onValueChange={setValue}
              >
                <ComboboxInput placeholder="Search fruits..." />
                <ComboboxPortal>
                  <ComboboxPositioner sideOffset={4}>
                    <ComboboxPopup>
                      <ComboboxList>
                        {FRUITS.map((fruit) => (
                          <ComboboxItem key={fruit} value={fruit} label={fruit}>
                            <ComboboxItemIndicator />
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxPopup>
                  </ComboboxPositioner>
                </ComboboxPortal>
              </Combobox>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          CONTROLLED
      -------------------------------------------------------- */}
      <StorySection
        title="Controlled"
        description="Manage value externally via value and onValueChange."
      >
        <StoryRow>
          <StoryItem label={`value: ${singleValue[0] ?? 'none'}`}>
            <div style={{ width: 240 }}>
              <Combobox
                value={singleValue}
                onValueChange={setSingleValue}
              >
                <ComboboxInput placeholder="Search fruits..." />
                <ComboboxPortal>
                  <ComboboxPositioner sideOffset={4}>
                    <ComboboxPopup>
                      <ComboboxList>
                        {FRUITS.map((fruit) => (
                          <ComboboxItem key={fruit} value={fruit} label={fruit}>
                            <ComboboxItemIndicator />
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxPopup>
                  </ComboboxPositioner>
                </ComboboxPortal>
              </Combobox>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

    </Story>
  );
};
