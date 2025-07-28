/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly as required
  const headerRow = ['Hero (hero12)'];

  // --- Background image row ---
  // Find background image: look for an absolutely positioned img inside this section
  let backgroundImg = element.querySelector('img.cover-image.utility-position-absolute');
  if (!backgroundImg) {
    // fallback: first image in the section
    backgroundImg = element.querySelector('img');
  }

  // Structure: always reference the original element (never clone)
  const backgroundRow = [backgroundImg ? backgroundImg : ''];

  // --- Content row ---
  // Find the main content area (the card with heading, list etc)
  let contentBlock = element.querySelector('.card.card-on-secondary');
  if (!contentBlock) {
    // fallback: look for the card body
    contentBlock = element.querySelector('.card-body');
  }
  if (!contentBlock) {
    // fallback: try to grab the main container with heading
    contentBlock = element.querySelector('.container, .w-layout-grid');
  }
  if (!contentBlock) {
    // fallback: just use the element itself
    contentBlock = element;
  }
  // Reference the existing element directly
  const contentRow = [contentBlock];

  // Compose the block table
  const cells = [headerRow, backgroundRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the original element with the new table
  element.replaceWith(block);
}
