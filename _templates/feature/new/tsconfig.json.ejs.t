---
to: features/<%= name %>/tsconfig.json
---
{
  "extends": "tsconfig/react-library.json",
  "include": ["."],
  "exclude": ["node_modules"]
}
