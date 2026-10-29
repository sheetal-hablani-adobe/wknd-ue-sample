/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article variant. Base: cards.
 * Source: https://wknd.site/us/en.html (Recent Articles + adventure list)
 * Selector: .image-list.list
 * Model: container with cards-article-card items.
 * Item fields: image (reference), imageAlt (collapsed), text (richtext)
 * Each row: [image cell, text cell (linked title, description)].
 *
 * Iterates the block-level li.cmp-image-list__item wrappers (not the inline
 * image/title anchors, which the importer may merge or drop) and rebuilds the
 * title link from the item's href.
 */
export default function parse(element, { document }) {
  const cells = [];

  const items = Array.from(element.querySelectorAll('li.cmp-image-list__item'));

  items.forEach((item) => {
    const img = item.querySelector('.cmp-image-list__item-image img, img');
    const titleEl = item.querySelector('.cmp-image-list__item-title');
    const descEl = item.querySelector('.cmp-image-list__item-description');
    const linkEl = item.querySelector('a.cmp-image-list__item-title-link[href], a.cmp-image-list__item-image-link[href], a[href]');
    const href = linkEl ? linkEl.getAttribute('href') : '';

    // Column 1: image
    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Column 2: text (richtext: linked title + description)
    const textFrag = document.createDocumentFragment();
    const textNodes = [];

    const titleText = titleEl ? titleEl.textContent.trim() : '';
    if (titleText) {
      const h3 = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = titleText;
        h3.appendChild(a);
      } else {
        h3.textContent = titleText;
      }
      textNodes.push(h3);
    }

    const descText = descEl ? descEl.textContent.trim() : '';
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      textNodes.push(p);
    }

    if (textNodes.length) {
      textFrag.appendChild(document.createComment(' field:text '));
      textNodes.forEach((n) => textFrag.appendChild(n));
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
