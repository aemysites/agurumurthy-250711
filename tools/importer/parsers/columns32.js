/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid with columns (should be 2 columns for this block)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const columns = Array.from(grid.children);
  if (columns.length !== 2) return;

  // First column: image (img element)
  const imageCol = columns[0];
  // Second column: content (text + labels + byline)
  const textCol = columns[1];

  // Compose header and row as per spec
  const header = ['Columns (columns32)'];
  const row = [imageCol, textCol];

  const table = WebImporter.DOMUtils.createTable([header, row], document);
  element.replaceWith(table);
}
