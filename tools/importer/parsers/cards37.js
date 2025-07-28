/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards37)'];

  // Helper: get text content as an array of elements: heading, para, cta (button or link)
  function getTextContent(card) {
    const textNodes = [];
    // Get heading (h2-h6, prefers h2/h3/h4)
    let heading = card.querySelector('h2, h3, h4, h5, h6');
    if (heading) textNodes.push(heading);
    // Get first or all paragraphs
    let paras = Array.from(card.querySelectorAll('p'));
    if (paras.length > 0) textNodes.push(...paras);
    // Get CTA: look for a.button, .button, or a.cta
    let cta = card.querySelector('a.button, .button, a.cta, a[role=button]');
    if (cta && !textNodes.includes(cta)) textNodes.push(cta);
    return textNodes;
  }

  // Find the main grid containing the cards
  const mainGrid = element.querySelector('.w-layout-grid.grid-layout');
  let cardElements = [];

  if (mainGrid) {
    // Try to get all first-level card links
    const mainChildren = Array.from(mainGrid.children);
    // If child is .utility-link-content-block, it's a card
    // If child is another grid, get its direct .utility-link-content-block children
    for (const child of mainChildren) {
      if (child.classList.contains('utility-link-content-block')) {
        cardElements.push(child);
      } else if (child.classList.contains('w-layout-grid')) {
        cardElements.push(...child.querySelectorAll(':scope > .utility-link-content-block'));
      }
    }
  }
  // Fallback if no cards were found above
  if (cardElements.length === 0) {
    cardElements = Array.from(element.querySelectorAll('.utility-link-content-block'));
  }

  // Build table rows: [image, text content]
  const rows = cardElements.map(card => {
    // Find image inside .utility-aspect-* (first img)
    let img = card.querySelector('img');
    // Defensive: ensure image is included, but allow null if not found
    let textContent = getTextContent(card);
    // If no structured text found, fallback to all text elements
    if (textContent.length === 0) {
      textContent = Array.from(card.querySelectorAll('h2,h3,h4,h5,h6,p,a'));
    }
    // If really nothing, fallback to card (should never happen)
    if (textContent.length === 0) textContent = [card];
    return [img, textContent];
  });

  // Compose and replace with table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
