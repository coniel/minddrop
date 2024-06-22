---
to: <%= module %>/<%= name %>/tsconfig.json
---
{
  "extends": "tsconfig/<% if(locals.react){ -%>react-library<% } else { -%>base<% } -%>.json",
  "include": ["."],
  "exclude": ["node_modules"]
}
