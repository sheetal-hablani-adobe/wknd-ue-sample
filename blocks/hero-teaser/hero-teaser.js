let teaserId = 0;

/**
 * Hero teaser: full-width image with a text panel overlapping its bottom edge.
 * Authored rows: image (picture with alt), text (heading, description, CTA link).
 * Rows are kept in place so Universal Editor instrumentation stays on them.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let hasImage = false;

  rows.forEach((row) => {
    const isImage = !!row.querySelector('picture, img') && !row.textContent.trim();
    if (isImage && !hasImage) {
      hasImage = true;
      row.classList.add('hero-teaser-image');
    } else {
      row.classList.add('hero-teaser-content');
    }
  });

  if (!hasImage) block.classList.add('no-image');

  // a lone link in its own paragraph is the CTA
  block.querySelectorAll('.hero-teaser-content p > a:only-child').forEach((link) => {
    if (link.parentElement.textContent.trim() === link.textContent.trim()) {
      link.classList.add('hero-teaser-cta');
    }
  });

  const heading = block.querySelector('.hero-teaser-content :is(h1, h2, h3, h4, h5, h6)');
  if (heading) {
    teaserId += 1;
    if (!heading.id) heading.id = `hero-teaser-${teaserId}-title`;
    block.setAttribute('role', 'region');
    block.setAttribute('aria-labelledby', heading.id);
  }
}
