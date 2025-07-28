/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid inside the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid as columns
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // According to the requirements, the header row must be a single cell
  const headerRow = ['Columns (columns35)'];

  // Create a single header row (one cell), and then a content row with N columns
  const tableRows = [
    headerRow,
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
