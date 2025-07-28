/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the columns (should be inside the .container)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get the direct children of the grid (these are columns)
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length < 2) return;
  // Example: first column is the text area, second is the image
  // Reference the DOM elements directly
  const leftCol = gridChildren[0];
  const rightCol = gridChildren[1];
  // Build cells array for columns block
  const cells = [
    ['Columns (columns27)'],
    [leftCol, rightCol]
  ];
  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
