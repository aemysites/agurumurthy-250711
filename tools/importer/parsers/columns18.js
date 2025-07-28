/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that contains the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get the immediate children of the grid
  const children = Array.from(grid.children);

  // The left column contains the headings and paragraph
  const leftCol = children.find(
    c => c.querySelector('h2') && c.querySelector('h3') && c.querySelector('p')
  );
  // The contact list (ul)
  const contactList = children.find(
    c => c.tagName === 'UL'
  );
  // The image
  const img = children.find(
    c => c.tagName === 'IMG'
  );

  // Create the cells array for the block table: header row (1 col), then 2 columns: left (text), right (contacts), right (image)
  // As per example, the first row should be a single cell, second row two columns: left block, right column - contact info, right image stacked vertically.
  // So, the right cell is an array: [contactList, img]

  const cells = [
    ['Columns (columns18)'],
    [leftCol, [contactList, img]]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
