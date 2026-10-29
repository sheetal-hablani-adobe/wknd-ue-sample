/* eslint-disable */
/* global WebImporter */

/**
 * WKND cleanup transformer.
 * Removes non-authorable chrome from the AEM Core Components WKND site.
 * Selectors are taken from migration-work/cleaned.html.
 */

const TRACKING_PATTERN = /demdex\.net|2o7\.net|omtrdc\.net|doubleclick\.net|google-analytics\.com|googletagmanager\.com|facebook\.com\/tr/i;

function removeAll(root, selectors) {
  selectors.forEach((selector) => {
    root.querySelectorAll(selector).forEach((el) => el.remove());
  });
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Header / footer experience fragments (migrated separately) and nav chrome
    removeAll(element, [
      'header.experiencefragment',
      '.cmp-experiencefragment--header',
      'footer.experiencefragment',
      '.cmp-experiencefragment--footer',
      '#toggleNav',
      '#mobileNav',
      '.cmp-navigation--mobile',
      '.cmp-languagenavigation',
      '.sign-in-buttons',
      '.wknd-sign-in-buttons',
    ]);

    // Cookie banners / consent / modals (generic, safe if absent)
    removeAll(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.cookie-banner',
      '[class*="cookie-consent"]',
      '[id*="cookie-consent"]',
      '[aria-modal="true"]',
    ]);

    // Tracking iframes and pixels (Adobe ID sync / demdex, 2o7 analytics)
    element.querySelectorAll('iframe').forEach((el) => {
      const src = el.getAttribute('src') || '';
      if (TRACKING_PATTERN.test(src) || el.classList.contains('aamIframeLoaded')
        || (el.id || '').startsWith('destination_publishing_iframe')) {
        el.remove();
      }
    });
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      const w = img.getAttribute('width');
      const h = img.getAttribute('height');
      if (TRACKING_PATTERN.test(src) || (w === '1' && h === '1') || (w === '0' && h === '0')) {
        img.remove();
      }
    });

    // Non-content elements
    removeAll(element, ['script', 'style', 'noscript', 'link']);
  }

  if (hookName === 'afterTransform') {
    // Source separators (div.separator > .cmp-separator > hr). Section breaks are
    // produced by the sections transformer, so source rules would create extra sections.
    // Removed here because section selectors (".separator + .title") rely on them earlier.
    removeAll(element, ['div.separator', '.cmp-separator']);

    // Core Components buttons ("All Articles", "All Trips") -> bold link paragraph,
    // which EDS decorates as a.button.primary (the WKND yellow CTA).
    element.querySelectorAll('.cmp-button--primary a.cmp-button, a.cmp-button').forEach((link) => {
      const doc = link.ownerDocument;
      const a = doc.createElement('a');
      a.setAttribute('href', link.getAttribute('href') || '#');
      a.textContent = link.textContent.trim();
      const strong = doc.createElement('strong');
      strong.append(a);
      const p = doc.createElement('p');
      p.append(strong);
      const wrapper = link.closest('.button') || link;
      wrapper.replaceWith(p);
    });

    // Leftover carousel controls (not authorable)
    removeAll(element, [
      '.cmp-carousel__actions',
      '.cmp-carousel__indicators',
      '.cmp-carousel__action',
    ]);

    // Remaining non-content elements
    removeAll(element, ['iframe', 'script', 'style', 'noscript', 'link']);

    // Tracking / data-layer attributes
    const trackingAttrs = [
      'data-cmp-data-layer',
      'data-cmp-data-layer-enabled',
      'data-cmp-data-layer-name',
      'data-cmp-link-accessibility-enabled',
      'data-cmp-link-accessibility-text',
      'data-cmp-clickable',
      'data-cmp-is',
      'data-cmp-hook-carousel',
      'data-analytics',
      'onclick',
    ];
    [element, ...element.querySelectorAll('*')].forEach((el) => {
      trackingAttrs.forEach((attr) => el.removeAttribute(attr));
      Array.from(el.attributes || []).forEach((attr) => {
        if (/^data-(cmp|analytics|track)/i.test(attr.name)) el.removeAttribute(attr.name);
      });
    });
  }
}
