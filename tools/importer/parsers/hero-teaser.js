/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-teaser variant. Base: hero.
 * Source: https://wknd.site/us/en.html
 * Selector: .teaser.cmp-teaser--imagebottom
 * Model: hero-teaser (simple block, 1 column).
 * Fields: image (reference), imageAlt (collapsed into img alt), text (richtext)
 * Row 1: image
 * Row 2: text (h2 title, description, CTA link)
 */
export default function parse(element, { document }) {
  const cells = [];

  const teaser = element.querySelector('.cmp-teaser') || element;
  const img = teaser.querySelector('.cmp-teaser__image img, img');
  const title = teaser.querySelector('.cmp-teaser__title');
  const description = teaser.querySelector('.cmp-teaser__description');
  const cta = teaser.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a[href]');

  // Row 1: image (alt carries imageAlt)
  const imageFrag = document.createDocumentFragment();
  if (img) {
    if (!img.getAttribute('alt') && img.getAttribute('title')) {
      img.setAttribute('alt', img.getAttribute('title'));
    }
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(img);
  }
  cells.push([imageFrag]);

  // Row 2: text (richtext: heading, description, CTA)
  const textFrag = document.createDocumentFragment();
  const textNodes = [];

  if (title && title.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = title.textContent.trim();
    textNodes.push(h2);
  }

  if (description && description.textContent.trim()) {
    const paras = Array.from(description.querySelectorAll('p'));
    if (paras.length) {
      paras.forEach((p) => textNodes.push(p));
    } else {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textNodes.push(p);
    }
  }

  if (cta && cta.textContent.trim()) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href') || '');
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    textNodes.push(p);
  }

  if (textNodes.length) {
    textFrag.appendChild(document.createComment(' field:text '));
    textNodes.forEach((n) => textFrag.appendChild(n));
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-teaser', cells });
  element.replaceWith(block);
}
