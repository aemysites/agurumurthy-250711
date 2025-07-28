/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Hero (hero28)'];

  // 2. Background Image row: Find first <img> inside .ix-parallax-scale-out-hero
  let backgroundImg = '';
  const bgImgDiv = element.querySelector('.ix-parallax-scale-out-hero');
  if (bgImgDiv) {
    const img = bgImgDiv.querySelector('img');
    if (img) {
      backgroundImg = img;
    }
  }

  // 3. Content row: Title, subheading, CTA, all inside .container > .utility-margin-bottom-6rem
  let contentCellContent = '';
  const container = element.querySelector('.container');
  if (container) {
    const contentDiv = container.querySelector('.utility-margin-bottom-6rem');
    if (contentDiv) {
      contentCellContent = contentDiv;
    }
  }

  // Build cells for the block table
  const cells = [
    headerRow,
    [backgroundImg],
    [contentCellContent]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
