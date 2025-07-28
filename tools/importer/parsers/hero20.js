/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero20)'];

  // Extract all hero images (background collage)
  // Images are inside: .ix-hero-scale-3x-to-1x .grid-layout > div > img
  let bgCell = '';
  const heroScale = element.querySelector('.ix-hero-scale-3x-to-1x');
  if (heroScale) {
    const grid = heroScale.querySelector('.grid-layout');
    if (grid) {
      const imgs = grid.querySelectorAll('img');
      if (imgs.length === 1) {
        bgCell = imgs[0];
      } else if (imgs.length > 1) {
        const bgDiv = document.createElement('div');
        imgs.forEach(img => bgDiv.appendChild(img));
        bgCell = bgDiv;
      }
    }
  }

  // Compose content cell: heading, subheading, CTAs (all together as in the HTML)
  let contentCell = '';
  const content = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  if (content) contentCell = content;

  // Build the table: header row, background image row, content row
  const cells = [
    headerRow,
    [bgCell],
    [contentCell],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}