/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container for columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Extract columns: each direct child of the grid is a column
  const columns = Array.from(grid.children);

  // Header row should be a single cell
  const headerRow = ['Columns (columns30)'];

  // Second row contains one cell per column
  const columnsRow = columns;

  const tableCells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
