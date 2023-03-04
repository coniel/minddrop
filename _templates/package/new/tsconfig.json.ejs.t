---
to: packages/<%= name %>/tsconfig.json
---
{
  "extends": "tsconfig/base.json",
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"]
}
