/* global WebImporter */
export default function parse(element, { document }) {
  // Find both main grid columns
  const sectionMainGrid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  const mainColumns = sectionMainGrid ? Array.from(sectionMainGrid.children) : [];
  const leftCol = mainColumns[0];
  const rightCol = mainColumns[1];

  // Find image grid, two images
  const imageGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column');
  const imageCells = imageGrid ? Array.from(imageGrid.children) : [];
  const leftImg = imageCells[0] ? imageCells[0].querySelector('img') : null;
  const rightImg = imageCells[1] ? imageCells[1].querySelector('img') : null;

  // Header row: must be a single cell array
  const headerRow = ['Columns (columns11)'];
  // Main content: two columns
  const firstContentRow = [leftCol, rightCol];
  // Images: two columns
  const secondContentRow = [leftImg, rightImg];

  // Compose the rows: header as single cell, content rows as two cells
  const rows = [
    headerRow,
    firstContentRow,
    secondContentRow
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
