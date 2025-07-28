/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header as in the example
  const cells = [
    ['Carousel']
  ];

  // Locate the card body (slide container)
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    // Extract the image (first required cell)
    const img = cardBody.querySelector('img');
    // Extract the heading (optional for text cell)
    const heading = cardBody.querySelector('.h4-heading');

    // Prepare the text content cell: preserve heading level and content if present
    let textCell = '';
    if (heading) {
      // Use the heading as an <h4> for semantic meaning
      const h4 = document.createElement('h4');
      h4.innerHTML = heading.innerHTML;
      textCell = h4;
    }
    // Add the slide row: image in first column, text (if any) in second
    cells.push([
      img,
      textCell
    ]);
  } else {
    // If no card body, add an empty data row to ensure structure
    cells.push(['','']);
  }

  // Create and insert the new table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
