/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that holds the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid (they are the columns)
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // Create the header row exactly as shown in the guidelines
  const headerRow = ['Columns (columns1)'];

  // Second row: each column content
  const secondRow = columns.map(col => col);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  // Replace the original element with the generated table
  element.replaceWith(table);
}
