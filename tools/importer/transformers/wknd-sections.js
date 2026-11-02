/* eslint-disable */
/* global WebImporter */

/**
 * WKND sections transformer.
 * beforeTransform: inserts <hr> section breaks (while parser targets still exist).
 * afterTransform: adds Section Metadata blocks for styled sections.
 */

const MARKER = 'data-excat-section-id';

function findSectionElement(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (let i = 0; i < selectors.length; i += 1) {
    const sel = selectors[i];
    if (sel) {
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
        // invalid selector, try next
      }
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument || payload.document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = findSectionElement(element, section);
      if (sectionEl && sectionEl.parentNode) {
        if (i > 0 || section.style) {
          const hr = doc.createElement('hr');
          // mark every break so section boundaries can be found after parsing
          hr.setAttribute(MARKER, section.id);
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (section.style) {
        const metadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Section Metadata goes at the end of the section: before the next section's break
        let nextHr = null;
        for (let j = i + 1; j < sections.length && !nextHr; j += 1) {
          nextHr = element.querySelector(`hr[${MARKER}="${sections[j].id}"]`);
        }
        if (nextHr && nextHr.parentNode) {
          nextHr.parentNode.insertBefore(metadata, nextHr);
        } else {
          const ownHr = element.querySelector(`hr[${MARKER}="${section.id}"]`);
          const sectionEl = findSectionElement(element, section);
          if (i === sections.length - 1 || (!ownHr && !sectionEl)) {
            element.appendChild(metadata);
          } else if (sectionEl && sectionEl.parentNode) {
            sectionEl.parentNode.insertBefore(metadata, sectionEl.nextSibling);
          } else {
            ownHr.parentNode.insertBefore(metadata, ownHr.nextSibling);
          }
        }
      }
    }

    // Remove the first section's temporary break and clean up markers
    const firstHr = element.querySelector(`hr[${MARKER}="${sections[0].id}"]`);
    if (firstHr) firstHr.remove();
    element.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => hr.removeAttribute(MARKER));
  }
}
