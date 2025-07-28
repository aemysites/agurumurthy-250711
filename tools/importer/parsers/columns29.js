/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell with the block name
  const headerRow = ['Columns (columns29)'];

  // Gather all direct child columns
  const columns = Array.from(element.children);
  // For each column, try to use its first child (usually the <img>), else the column itself
  const contentRow = columns.map(col => {
    const child = col.firstElementChild;
    return child ? child : col;
  });

  // Compose a table with a single header cell, and then a row for each column's content
  const cells = [
    headerRow,         // header row (1 cell)
    contentRow         // content row (n cells, one per column)
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
