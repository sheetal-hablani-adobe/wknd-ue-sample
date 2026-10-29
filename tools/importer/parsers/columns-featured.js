/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-featured variant. Base: columns.
 * Source: https://wknd.site/us/en.html
 * Selector: .teaser.cmp-teaser--featured
 * Model: columns (2 columns x 1 row). Columns blocks take no field hints.
 * Row: [image | eyebrow, h2 title, description, CTA link]
 */
export default function parse(element, { document }) {
  const cells = [];

  const teaser = element.querySelector('.cmp-teaser') || element;
  const img = teaser.querySelector('.cmp-teaser__image img, img');
  const pretitle = teaser.querySelector('.cmp-teaser__pretitle');
  const title = teaser.querySelector('.cmp-teaser__title');
  const description = teaser.querySelector('.cmp-teaser__description');
  const cta = teaser.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a[href]');

  // Column 1: image
  const imageCell = [];
  if (img) imageCell.push(img);

  // Column 2: text content
  const textCell = [];
  if (pretitle && pretitle.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = pretitle.textContent.trim();
    textCell.push(p);
  }
  if (title && title.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = title.textContent.trim();
    textCell.push(h2);
  }
  if (description && description.textContent.trim()) {
    const paras = Array.from(description.querySelectorAll('p'));
    if (paras.length) {
      paras.forEach((p) => textCell.push(p));
    } else {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.push(p);
    }
  }
  if (cta && cta.textContent.trim()) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href') || '');
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    textCell.push(p);
  }

  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
