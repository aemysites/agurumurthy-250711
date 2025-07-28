/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .grid-layout element that contains the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // Header row: exactly one cell with the correct block name
  const headerRow = ['Columns (columns31)'];

  // Content row: one cell per column from the grid
  const contentRow = columns;

  // Build the cells array correctly: header row is always a single cell
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
