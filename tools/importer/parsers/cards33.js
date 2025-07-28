/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards33)'];
  // Get all direct child <a> elements (each card)
  const cardAnchors = Array.from(element.querySelectorAll(':scope > a'));
  const rows = [headerRow];
  cardAnchors.forEach(a => {
    // Find the image (should be present)
    const img = a.querySelector('img');

    // Find the innermost div after the image (the text content)
    let textCol = null;
    if (img && img.parentElement) {
      // For robustness, get all div siblings of img inside the card-grid
      const grid = img.parentElement;
      const divSiblings = Array.from(grid.children).filter(el => el.tagName === 'DIV');
      textCol = divSiblings[0] || null;
    }
    // Fallback: use last div inside <a>
    if (!textCol) {
      const divs = Array.from(a.querySelectorAll('div'));
      textCol = divs[divs.length-1] || null;
    }
    rows.push([img, textCol]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
