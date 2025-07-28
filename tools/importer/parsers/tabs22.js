/* global WebImporter */
export default function parse(element, { document }) {
  // Find tab menu and content containers
  const menu = element.querySelector('.w-tab-menu');
  const content = element.querySelector('.w-tab-content');
  if (!menu || !content) return;

  // Get tab labels from menu
  const tabLinks = Array.from(menu.querySelectorAll('a.w-tab-link'));
  const tabLabels = tabLinks.map(link => {
    const div = link.querySelector('div');
    return div ? div.textContent.trim() : link.textContent.trim();
  });

  // Get tab panes
  const tabPanes = Array.from(content.querySelectorAll('div.w-tab-pane'));

  // Build table rows: header (single cell), then one row per tab (label, content)
  const rows = [];
  rows.push(['Tabs']); // Header is a single cell

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    const pane = tabPanes[i];
    let cellContent = [];
    if (pane) {
      // The pane usually has a single child div, use all its children
      // Fallback: use everything in the pane if structure is unexpected
      if (
        pane.children.length === 1 &&
        pane.children[0].children.length > 0
      ) {
        const main = pane.children[0];
        // Remove from DOM to prevent duplication
        cellContent = Array.from(main.children);
        cellContent.forEach(el => {
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      } else {
        cellContent = Array.from(pane.children);
        cellContent.forEach(el => {
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      }
      if (cellContent.length === 0) cellContent = [pane];
    }
    rows.push([label, cellContent]); // Each content row has two cells
  }

  // Because the header row has only one cell, and others have two,
  // we need to adjust the table after creation to ensure the header spans two columns
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Set colspan=2 on header cell
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 1) {
    firstRow.children[0].setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
