/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container inside the footer (the columns block)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Each immediate child of the grid is a column
  const columns = Array.from(grid.children);

  // For each column, collect its content as a div wrapper containing its children
  // This maintains semantic content, and ensures we're referencing (not cloning) existing elements
  const contentRow = columns.map((col) => {
    const wrapper = document.createElement('div');
    while (col.firstChild) {
      wrapper.appendChild(col.firstChild);
    }
    return wrapper;
  });

  // The header row must be a single cell, not one per column
  const cells = [
    ['Columns (columns9)'], // single header cell
    contentRow              // then one cell per column in the data row
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
