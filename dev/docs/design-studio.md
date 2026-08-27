# Design Studio

A drag-and-drop based tool for creating designs with which to render entries,
spaces and (later) component libraries.

## Data Model

- A design is typed by what it is for (`database` | `space` |
  `component-library`), a separate axis from the layout type (`card` | `list` |
  `page` | `space`), which says what an individual layout renders as.
- A design contains layouts, each holding a json tree of elements. Each element
  has a type, a set of token-based style properties, and possibly children.
  Layouts use only relative positioning.
- Elements are either structural (`container`, `page-panel`), static text
  (`text`, usually placed through roles like `heading`), or property elements
  (`property`) rendering a bound property through a presentation variant.
- Designs are stored as bundle directories
  (`workspace/.minddrop/designs/<designId>/` holding `design.json` + `media/`).
- Database designs are generic (not tied to a specific database) and carry
  their own property schema. To use one with a database, the database's
  properties are mapped onto the design's properties.
- Space designs are virtual: owned and persisted by their space (in
  `space.json`) and loaded into the designs store at startup.
