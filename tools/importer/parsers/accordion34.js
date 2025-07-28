/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name as specified
  const headerRow = ['Accordion (accordion34)'];
  const rows = [headerRow];

  // 2. Get all accordion blocks (direct children of element)
  const accordions = Array.from(element.querySelectorAll(':scope > .accordion'));

  // 3. For each accordion, extract: title cell, content cell
  accordions.forEach((accordion) => {
    // Title: .w-dropdown-toggle > .paragraph-lg (reference element directly)
    let titleEl = accordion.querySelector('.w-dropdown-toggle .paragraph-lg');
    if (!titleEl) {
      // fallback to w-dropdown-toggle text if .paragraph-lg missing
      const fallback = accordion.querySelector('.w-dropdown-toggle');
      if (fallback) {
        titleEl = document.createElement('span');
        titleEl.textContent = fallback.textContent.trim();
      } else {
        titleEl = document.createElement('span');
        titleEl.textContent = '';
      }
    }

    // Content: .accordion-content .w-richtext (reference element directly)
    let contentEl = accordion.querySelector('.accordion-content .w-richtext');
    if (!contentEl) {
      // fallback to .accordion-content inner div, or empty
      const fallback = accordion.querySelector('.accordion-content > div');
      if (fallback) {
        contentEl = fallback;
      } else {
        contentEl = document.createElement('div');
        contentEl.textContent = '';
      }
    }

    rows.push([titleEl, contentEl]);
  });

  // 4. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
