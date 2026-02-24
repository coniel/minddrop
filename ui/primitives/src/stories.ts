/**
 * stories.ts
 * Central registry of all component stories.
 * Imported by @minddrop/dev-tools — do not import from the main package barrel.
 *
 * To add a new story:
 * 1. Export a stories component from your component file
 * 2. Import it here and add it to the appropriate group
 */
import { ButtonStories } from './Button/Button.stories';
import { CollapsibleStories } from './Collapsible/Collapsible.stories';
import { ComboboxStories } from './Combox/Combobox.stories';
import { ConfirmationDialogStories } from './ConfirmationDialog/ConfirmationDialog.stories';
import { ContextMenuStories } from './ContextMenu/ContextMenu.stories';
import { DialogStories } from './Dialog/Dialog.stories';
import { DropdownMenuStories } from './DropdownMenu/DropdownMenu.stories';
import { IconButtonStories } from './IconButton/IconButton.stories';
import { KeyboardShortcutStories } from './KeyboardShortcut/KeyboardShortcut.stories';
import { LayoutStories } from './Layout/layout.stories';
import { MenuStories } from './Menu/Menu.stories';
import { NumberFieldStories } from './NumberField/NumberField.stories';
import { PopoverStories } from './Popover/Popover.stories';
import { RadioToggleGroupStories } from './RadioToggleGroup/RadioToggleGroup.stories';
import { ScrollAreaStories } from './ScrollArea/ScrollArea.stories';
import { SelectStories } from './Select/Select.stories';
import { SeparatorStories } from './Separator/Separator.stories';
import { SwitchStories } from './Switch/Switch.stories';
import { TextStories } from './Text/Text.stories';
import { ToggleStories } from './Toggle/Toggle.stories';
import { ToggleGroupStories } from './ToggleGroup/ToggleGroup.stories';
import { ToolbarStories } from './Toolbar';
import { TooltipStories } from './Tooltip/Tooltip.stories';
import { CheckboxStories } from './fields/Checkbox/Checkbox.stories';
import { RadioStories } from './fields/Radio/Radio.stories';
import { TextFieldStories } from './fields/TextField/TextField.stories';

export interface StoryItem {
  label: string;
  component: React.FC;
}

export interface StoryGroup {
  group: string;
  items: StoryItem[];
}

export const stories: StoryGroup[] = [
  {
    group: 'Primitives',
    items: [
      { label: 'Button', component: ButtonStories },
      { label: 'IconButton', component: IconButtonStories },
      { label: 'Text', component: TextStories },
      { label: 'Select', component: SelectStories },
      { label: 'KeyboardShortcut', component: KeyboardShortcutStories },
      { label: 'Separator', component: SeparatorStories },
    ],
  },
  {
    group: 'Layout',
    items: [
      { label: 'Flex / Group / Stack', component: LayoutStories },
      { label: 'Toolbar', component: ToolbarStories },
      { label: 'Collapsible', component: CollapsibleStories },
      { label: 'ScrollArea', component: ScrollAreaStories },
    ],
  },
  {
    group: 'Menu',
    items: [
      { label: 'Menu', component: MenuStories },
      { label: 'DropdownMenu', component: DropdownMenuStories },
      { label: 'ContextMenu', component: ContextMenuStories },
      { label: 'Combobox', component: ComboboxStories },
    ],
  },
  {
    group: 'Overlay',
    items: [
      { label: 'Tooltip', component: TooltipStories },
      { label: 'Dialog', component: DialogStories },
      { label: 'Popover', component: PopoverStories },
      { label: 'ConfirmationDialog', component: ConfirmationDialogStories },
    ],
  },
  {
    group: 'Fields',
    items: [
      { label: 'TextField', component: TextFieldStories },
      { label: 'NumberField', component: NumberFieldStories },
      { label: 'Checkbox', component: CheckboxStories },
      { label: 'Radio', component: RadioStories },
      { label: 'Toggle', component: ToggleStories },
      { label: 'ToggleGroup', component: ToggleGroupStories },
      { label: 'RadioToggleGroup', component: RadioToggleGroupStories },
      { label: 'Switch', component: SwitchStories },
    ],
  },
];
