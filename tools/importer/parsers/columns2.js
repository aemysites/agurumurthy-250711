/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the grid root that holds the two main column areas
  const container = element.querySelector('.container');
  if (!container) return;

  const grid = container.querySelector('.grid-layout');
  if (!grid) return;

  // The grid has one big left column and two right columns stacked
  const children = Array.from(grid.children);
  if (children.length < 3) return;

  // Left feature column (big card)
  const leftCol = children[0];

  // The right column is composed of the next two children stacked vertically
  // Wrap them in a div to preserve layout as a single cell
  const rightCol = document.createElement('div');
  rightCol.append(children[1], children[2]);

  // Table rows
  const headerRow = ['Columns (columns2)'];
  const contentRow = [leftCol, rightCol];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element in the DOM
  element.replaceWith(block);
}
