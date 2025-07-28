/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const headerRow = ['Accordion (accordion13)'];

  // Find all immediate .divider children representing accordion items
  const dividers = Array.from(element.querySelectorAll(':scope > .divider'));

  // For each divider, extract the title and content as elements
  const rows = dividers.map(divider => {
    // Each .divider contains a .w-layout-grid which holds the title and content
    const grid = divider.querySelector('.w-layout-grid');
    if (!grid) {
      // fallback: skip this divider
      return null;
    }
    // Get all direct children of the grid
    const children = Array.from(grid.children);
    // The typical structure is: [title, content]
    let titleEl = children[0] || document.createElement('span');
    let contentEl = children[1] || document.createElement('span');
    return [titleEl, contentEl];
  }).filter(Boolean); // Remove any nulls in case of unexpected structure

  // Compose the table array: header + rows
  const tableArray = [headerRow, ...rows];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  // Replace the original element
  element.replaceWith(block);
}
