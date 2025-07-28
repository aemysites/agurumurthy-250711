/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single column
  const headerRow = ['Columns (columns36)'];

  // Get the main grid layout containing the two columns
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;
  const cols = grid.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // Collect content for the left column: heading, subheading, button group
  const textCol = cols[0];
  const leftColContent = [];
  const heading = textCol.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) leftColContent.push(heading);
  const subheading = textCol.querySelector('p');
  if (subheading) leftColContent.push(subheading);
  const buttonGroup = textCol.querySelector('.button-group');
  if (buttonGroup) leftColContent.push(buttonGroup);

  // Collect all images for the right column
  const imagesCol = cols[1];
  let rightColContent = [];
  const imgGrid = imagesCol.querySelector('.grid-layout');
  if (imgGrid) {
    rightColContent = Array.from(imgGrid.querySelectorAll('img'));
  } else {
    rightColContent = Array.from(imagesCol.querySelectorAll('img'));
  }

  // The first row is the single-cell header row
  // The second row has as many columns as the layout: here, two columns
  const cells = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
