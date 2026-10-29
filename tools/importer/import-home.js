/* eslint-disable */
/* global WebImporter */

import cardsArticleParser from './parsers/cards-article.js';
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import heroTeaserParser from './parsers/hero-teaser.js';
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const PAGE_TEMPLATE = {
  "name": "home",
  "urls": [
    "https://wknd.site/us/en.html"
  ],
  "representativeUrl": "https://wknd.site/us/en.html",
  "description": "WKND home page: hero carousel, featured article, recent article cards, next adventure teaser and adventure cards",
  "blocks": [
    {
      "name": "carousel-hero",
      "instances": [
        ".carousel.cmp-carousel--hero"
      ]
    },
    {
      "name": "columns-featured",
      "instances": [
        ".teaser.cmp-teaser--featured"
      ]
    },
    {
      "name": "cards-article",
      "instances": [
        ".image-list.list"
      ]
    },
    {
      "name": "hero-teaser",
      "instances": [
        ".teaser.cmp-teaser--imagebottom"
      ]
    }
  ],
  "urlPattern": "/us/*",
  "sections": [
    {
      "id": "section-1",
      "name": "Hero carousel",
      "selector": [
        ".carousel.cmp-carousel--hero"
      ],
      "style": null,
      "blocks": [
        "carousel-hero"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Featured article",
      "selector": [
        ".teaser.cmp-teaser--featured"
      ],
      "style": null,
      "blocks": [
        "columns-featured"
      ],
      "defaultContent": []
    },
    {
      "id": "section-3",
      "name": "Recent Articles",
      "selector": [
        ".cmp-teaser--featured + .title.cmp-title--underline"
      ],
      "style": "divider",
      "blocks": [
        "cards-article"
      ],
      "defaultContent": [
        ".cmp-teaser--featured + .title.cmp-title--underline",
        ".cmp-teaser--featured ~ .button.cmp-button--primary"
      ]
    },
    {
      "id": "section-4",
      "name": "Next Adventures",
      "selector": [
        ".separator + .title.cmp-title--underline"
      ],
      "style": null,
      "blocks": [
        "hero-teaser"
      ],
      "defaultContent": [
        ".separator + .title.cmp-title--underline"
      ]
    },
    {
      "id": "section-5",
      "name": "Where do you want to go",
      "selector": [
        ".cmp-teaser--imagebottom + main.cmp-layout-container--fixed"
      ],
      "style": "divider",
      "blocks": [
        "cards-article"
      ],
      "defaultContent": [
        ".cmp-teaser--imagebottom + main.cmp-layout-container--fixed .title",
        ".cmp-teaser--imagebottom + main.cmp-layout-container--fixed .button.cmp-button--primary"
      ]
    }
  ]
};

const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-featured': columnsFeaturedParser,
  'cards-article': cardsArticleParser,
  'hero-teaser': heroTeaserParser,
};

const transformers = [wkndCleanupTransformer, wkndSectionsTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
