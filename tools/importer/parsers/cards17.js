/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards17)'];

  // Each direct child div represents a card with an image
  const cardDivs = element.querySelectorAll(':scope > div');

  // For each card, extract the image element
  // Since there is no text content in the provided HTML, second column is left empty
  const rows = Array.from(cardDivs).map((div) => {
    const img = div.querySelector('img');
    // If no img is found, fallback to an empty string
    return [img || '', ''];
  });

  // Combine header and rows
  const tableArray = [headerRow, ...rows];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(tableArray, document);

  // Replace the original element
  element.replaceWith(block);
}