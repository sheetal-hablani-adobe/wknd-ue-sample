/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero variant. Base: carousel.
 * Source: https://wknd.site/us/en.html
 * Selector: .carousel.cmp-carousel--hero
 * Model: container with carousel-hero-item children.
 * Item fields: media_image (reference), media_imageAlt (collapsed), content_text (richtext)
 * Each row: [image cell, text cell (h2 title, description, CTA link)].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each slide is a block-level .cmp-carousel__item wrapping a .cmp-teaser
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));

  slides.forEach((slide) => {
    const teaser = slide.querySelector('.cmp-teaser') || slide;
    const img = teaser.querySelector('.cmp-teaser__image img, img');
    const title = teaser.querySelector('.cmp-teaser__title');
    const description = teaser.querySelector('.cmp-teaser__description');
    const cta = teaser.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a[href]');

    // Column 1: media_image
    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(' field:media_image '));
      imageFrag.appendChild(img);
    }

    // Column 2: content_text (richtext: heading, description, CTA)
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
      textFrag.appendChild(document.createComment(' field:content_text '));
      textNodes.forEach((n) => textFrag.appendChild(n));
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
