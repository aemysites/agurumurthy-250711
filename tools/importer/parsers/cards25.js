/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the block name in the requirements
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // To extract a text block (with h3 and p) from an element
  function getTextContent(container) {
    if (!container) return '';
    const frag = document.createDocumentFragment();
    // Get h3 and p in order, if present
    const heading = container.querySelector('h3');
    const desc = container.querySelector('p');
    if (heading) frag.appendChild(heading);
    if (desc) frag.appendChild(desc);
    return frag.childNodes.length > 0 ? frag : '';
  }

  // Iterate over each immediate card container
  element.querySelectorAll(':scope > div').forEach((card) => {
    // Look for the image in this card
    const img = card.querySelector('img');
    // Look for the text content container
    const textWrap = card.querySelector('.utility-padding-all-2rem');
    // If both image and text are present, it's a full card
    if (img && textWrap) {
      rows.push([img, getTextContent(textWrap)]);
    } else if (img) {
      // Card with only an image
      rows.push([img, '']);
    }
    // if neither, skip (shouldn't occur but safe)
  });

  // Build the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
