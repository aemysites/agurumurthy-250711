/* global WebImporter */
export default function parse(element, { document }) {
  // Correct header row: one column with the block name
  const headerRow = ['Columns (columns38)'];

  // Extract direct child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, if there is only one child and it's an image, just use the image; else, use the whole column
  const contentRow = columns.map(col => {
    const img = col.querySelector('img');
    if (img && col.children.length === 1) {
      return img;
    }
    return col;
  });

  // Ensure the first row is single cell (header) and second row is as many columns as needed
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
