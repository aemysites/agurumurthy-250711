/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, collect ALL direct children (not just images, but also text, buttons, etc)
  const columnCells = columns.map(col => {
    // If column has more than one child, collect all. If just one, keep that element.
    // Use Array.from to handle NodeList
    const children = Array.from(col.childNodes).filter(n =>
      n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '')
    );
    // If multiple children, include all. If only one, just use that node directly.
    if (children.length === 1) {
      return children[0];
    } else if (children.length > 1) {
      return children;
    } else {
      // fallback: the column itself (for resilience)
      return col;
    }
  });

  // Build the table: first row is header (single column), second row is one cell per column
  const headerRow = ['Columns (columns4)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnCells
  ], document);
  element.replaceWith(table);
}
