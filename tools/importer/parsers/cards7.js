/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards7)'];

  // Get the card containers (direct children)
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  // Each card: first cell = image, second cell = (text content, none in provided HTML)
  const rows = cards.map(cardDiv => {
    // Find the image, reference it directly
    const img = cardDiv.querySelector('img');
    // Second cell: no text content available in HTML
    return [img, ''];
  });

  // Compose the table array
  const cells = [headerRow, ...rows];

  // Create block and replace original
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
