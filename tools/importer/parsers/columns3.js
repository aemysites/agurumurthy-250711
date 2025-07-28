/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get all immediate child column elements
  const columns = Array.from(grid.children);
  // Block header row matches the spec
  const headerRow = ['Columns (columns3)'];
  // Each cell is a reference to the corresponding column
  const contentRow = columns.map(col => col);
  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  // Replace the original element
  element.replaceWith(table);
}
