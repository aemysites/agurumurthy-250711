/* global WebImporter */
export default function parse(element, { document }) {
  // Build up the rows: first row is header
  const cells = [['Cards (cards19)']];
  // Each card is a direct child div
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach(cardDiv => {
    // First cell: icon/svg (found inside div.icon, which is inside a child div)
    let iconDiv = cardDiv.querySelector(':scope > div > .icon');
    let icon = iconDiv ? iconDiv : cardDiv.querySelector(':scope > div svg');
    if (!icon) {
      icon = document.createElement('div');
    }
    // Second cell: text paragraph (usually a single <p>)
    let text = cardDiv.querySelector('p');
    if (!text) {
      // fallback for missing p
      text = document.createElement('div');
      text.textContent = cardDiv.textContent;
    }
    cells.push([icon, text]);
  });
  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
