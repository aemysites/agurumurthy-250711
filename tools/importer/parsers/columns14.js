/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid which holds the columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // The first child is the heading, the rest is the right column
  const children = Array.from(grid.children);
  if (children.length < 2) return;

  // left column: the heading
  const leftCol = children[0];
  // right column: all subsequent children
  const rightColContent = [];
  for (let i = 1; i < children.length; i++) {
    rightColContent.push(children[i]);
  }
  // If there's only one right column child, use it directly
  const rightCol = rightColContent.length === 1 ? rightColContent[0] : rightColContent;

  const headerRow = ['Columns (columns14)'];
  const contentRow = [leftCol, rightCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
