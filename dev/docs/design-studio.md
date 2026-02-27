# Design Studio

A simple drag-and-drop based tool for creating designs with which to render entries.

There are three design types:

- Card: used in gallery type views
- List: used in list views and for lists of entries in split view (list on left,
  page on right)
- Page: renders a single entry as a page

## Data Model

- Designs contain are a json tree of elements. Each element has a type, a set of
  style properties, and possibly children. The design uses only relative positioning.
- Designs are stored as json files (with a .design file extension) in workspace/.minddrop/designs.
- They are generic (not tied to a specific database). To use a design with a database,
  the database properties must be mapped to the design's element slots.
