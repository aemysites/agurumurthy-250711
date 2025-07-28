/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name
  const headerRow = ['Hero (hero39)'];

  // 2. Background image row: look for the main hero image
  let bgImg = element.querySelector('img');
  const imageRow = [bgImg ? bgImg : ''];

  // 3. Content row: locate the content area with heading, paragraph, and button(s)
  let contentCell = '';
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (grid) {
    const gridChildren = grid.querySelectorAll(':scope > div');
    // The second grid child contains the content (headings, paragraph, cta)
    if (gridChildren.length > 1) {
      // Look for the actual container with heading + content (usually a grid or flex)
      const contentArea = gridChildren[1];
      // Find the deepest grid (tablet-1-column) that contains heading, text, cta
      let innerContent = contentArea.querySelector('.w-layout-grid.tablet-1-column.grid-gap-lg.y-bottom');
      if (innerContent) {
        contentCell = innerContent;
      } else {
        // If the inner grid is not found, fall back to the container itself
        contentCell = contentArea;
      }
    }
  }
  const contentRow = [contentCell];

  // Compose the table in the correct 1col/3row format
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table block
  element.replaceWith(table);
}
