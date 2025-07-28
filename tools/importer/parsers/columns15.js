/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid of columns inside the section
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.w-layout-grid');
  if (!grid) return;
  // For columns15, we want a two column layout: left (main text/buttons), right (main image)
  const gridChildren = Array.from(grid.children);

  // The most common structure: one div with all text/buttons, one img
  // We'll extract the text block and the image block as two columns
  // But both left and right could be divs or imgs (support both kinds)

  // If there are more than two columns, take the first two (for safety)
  let leftContent = [];
  let rightContent = [];

  if (gridChildren.length >= 2) {
    // Left: all children of first element, or the element itself if not a container
    const left = gridChildren[0];
    if (left.children.length > 0) {
      leftContent = Array.from(left.children);
    } else {
      leftContent = [left];
    }
    // Right: if image, use directly; otherwise, all children or itself
    const right = gridChildren[1];
    if (right.tagName === 'IMG') {
      rightContent = [right];
    } else if (right.children.length > 0) {
      rightContent = Array.from(right.children);
    } else {
      rightContent = [right];
    }
  } else if (gridChildren.length === 1) {
    // Only one child: put all its children in left column, leave right blank
    if (gridChildren[0].children.length > 0) {
      leftContent = Array.from(gridChildren[0].children);
    } else {
      leftContent = [gridChildren[0]];
    }
    rightContent = [''];
  }

  // Remove empty text nodes and whitespace
  leftContent = leftContent.filter(
    node => (node.nodeType !== Node.TEXT_NODE) || node.textContent.trim().length > 0
  );
  rightContent = rightContent.filter(
    node => (node.nodeType !== Node.TEXT_NODE) || node.textContent.trim().length > 0
  );

  if (leftContent.length === 0) leftContent = [''];
  if (rightContent.length === 0) rightContent = [''];

  // Build table rows
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
