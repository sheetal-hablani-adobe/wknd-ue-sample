/**
 * Featured teaser: one row, image column beside a text panel column.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  block.classList.add(`columns-featured-${firstRow.children.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const wrapper = pic && pic.closest('div');
      // picture is the only content in the column
      if (wrapper && wrapper.children.length === 1 && !wrapper.textContent.trim()) {
        wrapper.classList.add('columns-featured-img-col');
      } else {
        col.classList.add('columns-featured-text-col');
      }
    });
  });
}
