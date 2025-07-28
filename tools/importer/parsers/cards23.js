/* global WebImporter */
export default function parse(element, { document }) {
  // Find the active tab pane (the visible card group), fallback to first if none marked active
  const panes = element.querySelectorAll('.w-tab-pane');
  let activePane = null;
  for (const pane of panes) {
    if (pane.classList.contains('w--tab-active')) {
      activePane = pane;
      break;
    }
  }
  if (!activePane && panes.length) activePane = panes[0];
  if (!activePane) return;

  // Find the grid containing cards
  const grid = activePane.querySelector('.w-layout-grid');
  if (!grid) return;

  // Find all direct <a> children in the grid (each is a card)
  const cards = Array.from(grid.children).filter(el => el.tagName === 'A');

  // Prepare the table header row
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  // For each card, extract image (left cell) and all text (right cell)
  for (const card of cards) {
    // --- Image cell ---
    let img = card.querySelector('img'); // reference, do not clone
    // --- Text cell ---
    // Collect all headings and paragraph-like nodes in DOM order
    const textElems = [];
    card.childNodes.forEach(node => {
      // Extract only visible elements (exclude image wrappers)
      if (node.nodeType === 1) {
        // h3 or other heading
        if (/^H[1-6]$/i.test(node.tagName)) {
          textElems.push(node);
        } else if (node.classList.contains('utility-text-align-center')) {
          // Special case: inner div contains heading/description (for centered cards)
          Array.from(node.querySelectorAll('h3, .paragraph-sm')).forEach(e => textElems.push(e));
        } else if (node.classList.contains('paragraph-sm')) {
          textElems.push(node);
        } else if (node.classList.contains('utility-aspect-3x2')) {
          // skip image wrapper
        } else if (node.classList.contains('flex-horizontal')) {
          // For block types with inner flex layout, get their inner text content
          Array.from(node.querySelectorAll('h3, .paragraph-sm')).forEach(e => textElems.push(e));
        }
      }
    });
    // Fallback: if we found no textElems, try searching all h3 and .paragraph-sm anywhere in the card
    let textCell = textElems.length ? textElems : Array.from(card.querySelectorAll('h3, .paragraph-sm'));
    // Edge fallback: if still no text, just add the card's text content
    if (!textCell.length) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.textContent = card.textContent.trim();
      textCell = [fallbackDiv];
    }
    rows.push([
      img ? img : '',
      textCell.length > 1 ? textCell : textCell[0]
    ]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
