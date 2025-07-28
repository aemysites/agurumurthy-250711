/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns (images/text/other inline content)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Each direct child of grid is a column; get the full content of each column
  const columnDivs = Array.from(grid.children);
  // For each column, collect all content inside it (not just images)
  const columnCells = columnDivs.map(col => {
    // If column has only one child, use the child; else, use all children as array
    const nodes = Array.from(col.childNodes).filter(n => {
      // Remove empty text nodes
      return !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim());
    });
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;
    return '';
  });

  // Header row: exactly one column, block name
  const headerRow = ['Columns (columns16)'];
  const cells = [
    headerRow,
    columnCells
  ];

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
