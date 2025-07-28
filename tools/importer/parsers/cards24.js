/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row
  const cells = [['Cards (cards24)']];

  // Get all direct card links
  const cards = element.querySelectorAll(':scope > a.utility-link-content-block');
  cards.forEach((card) => {
    // First child: image wrapper div > img
    const imgWrapper = card.querySelector(':scope > div');
    const img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Tag/date section: second div
    const metaDiv = card.querySelectorAll(':scope > div')[1];
    let metaContent = '';
    if (metaDiv) {
      const tag = metaDiv.querySelector('.tag');
      const date = metaDiv.querySelector('.paragraph-sm');
      if (tag && date) {
        metaContent = tag.textContent + ' | ' + date.textContent;
      } else if (tag) {
        metaContent = tag.textContent;
      } else if (date) {
        metaContent = date.textContent;
      }
    }
    
    // Title
    const heading = card.querySelector('h3');

    // Build the right column content
    const content = [];
    if (metaContent) {
      const metaP = document.createElement('p');
      metaP.textContent = metaContent;
      content.push(metaP);
    }
    if (heading) content.push(heading);

    // Each row: [image, text content]
    cells.push([
      img,
      content.length > 0 ? content : ''
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
