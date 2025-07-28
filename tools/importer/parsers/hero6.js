/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const headerRow = ['Hero (hero6)'];

  // --- Row 2: Background Image ---
  // Find the background image (img with class 'cover-image')
  let bgImg = element.querySelector('img.cover-image');
  let backgroundRow = [bgImg ? bgImg : ''];

  // --- Row 3: Text & CTA Content ---
  // Find the card that contains h1, subheading, buttons
  let card = element.querySelector('.card');
  let contentRow;
  if (card) {
    contentRow = [card]; // Reference the full card node (retains all formatting/semantic structure)
  } else {
    contentRow = [''];
  }

  // Compose the cells for the block table (1 column, 3 rows)
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
