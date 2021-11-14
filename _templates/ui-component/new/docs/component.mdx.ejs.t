---
to: packages/docs/data/ui/components/<%= h.toKebabCase(name) %>.mdx
---
---
metaTitle: <%= name %>
metaDescription: Description
name: <%= h.toKebabCase(name) %>
---

# <%= name %>

<Description>
  Description
</Description>

<HeroContainer>
  <<%= name %>Demo />
</HeroContainer>

```jsx hero template=<%= name %>Demo

```

<Highlights
  features={[
    'Feature 1.',
    'Feature 2.',
  ]}
/>

## Usage

Import the component from the `@minddrop/ui` package.

```jsx
import { <%= name %> } from '@minddrop/ui';

export default () => {
  return (
    <<%= name %> />
  );
};
```

## API Reference

`<%= name %>Props` extends `React.HTMLAttributes<HTMLDivElement>`.

<PropsTable
  data={[
    {
      name: 'children',
      type: 'node',
    },
  ]}
/>

## Accessibility

Adheres to the [Button WAI-ARIA design pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#button).

### Keyboard Interactions

<KeyboardTable
  data={[
    {
      keys: ['Space'],
      description: 'Activates the button.',
    },
    {
      keys: ['Enter'],
      description: 'Activates the button.',
    },
  ]}
/>
