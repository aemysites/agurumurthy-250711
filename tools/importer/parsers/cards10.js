/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards10)'];
  // Get all direct child <a> elements (cards)
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  const rows = cards.map(card => {
    // First cell: image (mandatory)
    let img = null;
    const imgContainer = card.querySelector('.utility-aspect-3x2');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    // Second cell: text content
    const textCellElements = [];
    const textDiv = card.querySelector('.utility-padding-all-1rem');
    if (textDiv) {
      // Tag (optional, upper-case label)
      const tag = textDiv.querySelector('.tag');
      if (tag) textCellElements.push(tag);
      // Heading (mandatory, h3 or .h4-heading)
      const heading = textDiv.querySelector('h3, .h4-heading');
      if (heading) textCellElements.push(heading);
      // Description (optional, .paragraph-sm)
      // Use the FIRST p in this section that is NOT inside a .tag
      // (to avoid duplicate tag text)
      const paras = Array.from(textDiv.querySelectorAll('p'));
      const desc = paras.find(p => !p.closest('.tag'));
      if (desc) textCellElements.push(desc);
    }
    return [img, textCellElements];
  });
  const tableArr = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(table);
}
