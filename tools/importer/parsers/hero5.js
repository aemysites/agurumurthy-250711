/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be exactly as per example
  const headerRow = ['Hero (hero5)'];

  // Find the hero image: always a visible <img> in the grid
  // Look for an <img> that is a direct child (at any level)
  const img = element.querySelector('img');
  // If there is no image, fallback to empty cell
  const row2 = [img ? img : ''];

  // Find the main text/cta container inside the grid(s)
  // The structure is: section > .w-layout-grid (outer) > .w-layout-grid (inner) > div (content) + img
  let mainTextBlock = null;
  const outerGrid = element.querySelector(':scope > .w-layout-grid');
  if (outerGrid) {
    const innerGrid = outerGrid.querySelector('.w-layout-grid');
    if (innerGrid) {
      // The content is in the first div inside innerGrid
      const possibleDivs = innerGrid.querySelectorAll(':scope > div');
      if (possibleDivs.length) {
        mainTextBlock = possibleDivs[0];
      }
    }
  }
  // Fallback if structure differs
  if (!mainTextBlock) {
    mainTextBlock = element;
  }

  // Row 3: content block (heading, paragraph, CTAs)
  const row3 = [mainTextBlock];

  // Compose table
  const cells = [headerRow, row2, row3];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
