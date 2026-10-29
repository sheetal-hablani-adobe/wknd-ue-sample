/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/cards-article.js
  function parse(element, { document }) {
    const cells = [];
    const items = Array.from(element.querySelectorAll("li.cmp-image-list__item"));
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image-list__item-image img, img");
      const titleEl = item.querySelector(".cmp-image-list__item-title");
      const descEl = item.querySelector(".cmp-image-list__item-description");
      const linkEl = item.querySelector("a.cmp-image-list__item-title-link[href], a.cmp-image-list__item-image-link[href], a[href]");
      const href = linkEl ? linkEl.getAttribute("href") : "";
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      const textNodes = [];
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      if (titleText) {
        const h3 = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleText;
          h3.appendChild(a);
        } else {
          h3.textContent = titleText;
        }
        textNodes.push(h3);
      }
      const descText = descEl ? descEl.textContent.trim() : "";
      if (descText) {
        const p = document.createElement("p");
        p.textContent = descText;
        textNodes.push(p);
      }
      if (textNodes.length) {
        textFrag.appendChild(document.createComment(" field:text "));
        textNodes.forEach((n) => textFrag.appendChild(n));
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-hero.js
  function parse2(element, { document }) {
    const cells = [];
    const slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    slides.forEach((slide) => {
      const teaser = slide.querySelector(".cmp-teaser") || slide;
      const img = teaser.querySelector(".cmp-teaser__image img, img");
      const title = teaser.querySelector(".cmp-teaser__title");
      const description = teaser.querySelector(".cmp-teaser__description");
      const cta = teaser.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a[href]");
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(" field:media_image "));
        imageFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      const textNodes = [];
      if (title && title.textContent.trim()) {
        const h2 = document.createElement("h2");
        h2.textContent = title.textContent.trim();
        textNodes.push(h2);
      }
      if (description && description.textContent.trim()) {
        const paras = Array.from(description.querySelectorAll("p"));
        if (paras.length) {
          paras.forEach((p) => textNodes.push(p));
        } else {
          const p = document.createElement("p");
          p.textContent = description.textContent.trim();
          textNodes.push(p);
        }
      }
      if (cta && cta.textContent.trim()) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", cta.getAttribute("href") || "");
        a.textContent = cta.textContent.trim();
        p.appendChild(a);
        textNodes.push(p);
      }
      if (textNodes.length) {
        textFrag.appendChild(document.createComment(" field:content_text "));
        textNodes.forEach((n) => textFrag.appendChild(n));
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse3(element, { document }) {
    const cells = [];
    const teaser = element.querySelector(".cmp-teaser") || element;
    const img = teaser.querySelector(".cmp-teaser__image img, img");
    const pretitle = teaser.querySelector(".cmp-teaser__pretitle");
    const title = teaser.querySelector(".cmp-teaser__title");
    const description = teaser.querySelector(".cmp-teaser__description");
    const cta = teaser.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a[href]");
    const imageCell = [];
    if (img) imageCell.push(img);
    const textCell = [];
    if (pretitle && pretitle.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = pretitle.textContent.trim();
      textCell.push(p);
    }
    if (title && title.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = title.textContent.trim();
      textCell.push(h2);
    }
    if (description && description.textContent.trim()) {
      const paras = Array.from(description.querySelectorAll("p"));
      if (paras.length) {
        paras.forEach((p) => textCell.push(p));
      } else {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.push(p);
      }
    }
    if (cta && cta.textContent.trim()) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.setAttribute("href", cta.getAttribute("href") || "");
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      textCell.push(p);
    }
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-teaser.js
  function parse4(element, { document }) {
    const cells = [];
    const teaser = element.querySelector(".cmp-teaser") || element;
    const img = teaser.querySelector(".cmp-teaser__image img, img");
    const title = teaser.querySelector(".cmp-teaser__title");
    const description = teaser.querySelector(".cmp-teaser__description");
    const cta = teaser.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a[href]");
    const imageFrag = document.createDocumentFragment();
    if (img) {
      if (!img.getAttribute("alt") && img.getAttribute("title")) {
        img.setAttribute("alt", img.getAttribute("title"));
      }
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(img);
    }
    cells.push([imageFrag]);
    const textFrag = document.createDocumentFragment();
    const textNodes = [];
    if (title && title.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = title.textContent.trim();
      textNodes.push(h2);
    }
    if (description && description.textContent.trim()) {
      const paras = Array.from(description.querySelectorAll("p"));
      if (paras.length) {
        paras.forEach((p) => textNodes.push(p));
      } else {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textNodes.push(p);
      }
    }
    if (cta && cta.textContent.trim()) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.setAttribute("href", cta.getAttribute("href") || "");
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      textNodes.push(p);
    }
    if (textNodes.length) {
      textFrag.appendChild(document.createComment(" field:text "));
      textNodes.forEach((n) => textFrag.appendChild(n));
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TRACKING_PATTERN = /demdex\.net|2o7\.net|omtrdc\.net|doubleclick\.net|google-analytics\.com|googletagmanager\.com|facebook\.com\/tr/i;
  function removeAll(root, selectors) {
    selectors.forEach((selector) => {
      root.querySelectorAll(selector).forEach((el) => el.remove());
    });
  }
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      removeAll(element, [
        "header.experiencefragment",
        ".cmp-experiencefragment--header",
        "footer.experiencefragment",
        ".cmp-experiencefragment--footer",
        "#toggleNav",
        "#mobileNav",
        ".cmp-navigation--mobile",
        ".cmp-languagenavigation",
        ".sign-in-buttons",
        ".wknd-sign-in-buttons"
      ]);
      removeAll(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".cookie-banner",
        '[class*="cookie-consent"]',
        '[id*="cookie-consent"]',
        '[aria-modal="true"]'
      ]);
      element.querySelectorAll("iframe").forEach((el) => {
        const src = el.getAttribute("src") || "";
        if (TRACKING_PATTERN.test(src) || el.classList.contains("aamIframeLoaded") || (el.id || "").startsWith("destination_publishing_iframe")) {
          el.remove();
        }
      });
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        const w = img.getAttribute("width");
        const h = img.getAttribute("height");
        if (TRACKING_PATTERN.test(src) || w === "1" && h === "1" || w === "0" && h === "0") {
          img.remove();
        }
      });
      removeAll(element, ["script", "style", "noscript", "link"]);
    }
    if (hookName === "afterTransform") {
      removeAll(element, ["div.separator", ".cmp-separator"]);
      element.querySelectorAll(".cmp-button--primary a.cmp-button, a.cmp-button").forEach((link) => {
        const doc = link.ownerDocument;
        const a = doc.createElement("a");
        a.setAttribute("href", link.getAttribute("href") || "#");
        a.textContent = link.textContent.trim();
        const strong = doc.createElement("strong");
        strong.append(a);
        const p = doc.createElement("p");
        p.append(strong);
        const wrapper = link.closest(".button") || link;
        wrapper.replaceWith(p);
      });
      removeAll(element, [
        ".cmp-carousel__actions",
        ".cmp-carousel__indicators",
        ".cmp-carousel__action"
      ]);
      removeAll(element, ["iframe", "script", "style", "noscript", "link"]);
      const trackingAttrs = [
        "data-cmp-data-layer",
        "data-cmp-data-layer-enabled",
        "data-cmp-data-layer-name",
        "data-cmp-link-accessibility-enabled",
        "data-cmp-link-accessibility-text",
        "data-cmp-clickable",
        "data-cmp-is",
        "data-cmp-hook-carousel",
        "data-analytics",
        "onclick"
      ];
      [element, ...element.querySelectorAll("*")].forEach((el) => {
        trackingAttrs.forEach((attr) => el.removeAttribute(attr));
        Array.from(el.attributes || []).forEach((attr) => {
          if (/^data-(cmp|analytics|track)/i.test(attr.name)) el.removeAttribute(attr.name);
        });
      });
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var MARKER = "data-excat-section-id";
  function findSectionElement(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (let i = 0; i < selectors.length; i += 1) {
      const sel = selectors[i];
      if (sel) {
        try {
          const el = root.querySelector(sel);
          if (el) return el;
        } catch (e) {
        }
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument || payload.document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const sectionEl = findSectionElement(element, section);
        if (sectionEl && sectionEl.parentNode) {
          if (i > 0 || section.style) {
            const hr = doc.createElement("hr");
            hr.setAttribute(MARKER, section.id);
            sectionEl.parentNode.insertBefore(hr, sectionEl);
          }
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (section.style) {
          const metadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          let nextHr = null;
          for (let j = i + 1; j < sections.length && !nextHr; j += 1) {
            nextHr = element.querySelector(`hr[${MARKER}="${sections[j].id}"]`);
          }
          if (nextHr && nextHr.parentNode) {
            nextHr.parentNode.insertBefore(metadata, nextHr);
          } else {
            const ownHr = element.querySelector(`hr[${MARKER}="${section.id}"]`);
            const sectionEl = findSectionElement(element, section);
            if (i === sections.length - 1 || !ownHr && !sectionEl) {
              element.appendChild(metadata);
            } else if (sectionEl && sectionEl.parentNode) {
              sectionEl.parentNode.insertBefore(metadata, sectionEl.nextSibling);
            } else {
              ownHr.parentNode.insertBefore(metadata, ownHr.nextSibling);
            }
          }
        }
      }
      const firstHr = element.querySelector(`hr[${MARKER}="${sections[0].id}"]`);
      if (firstHr) firstHr.remove();
      element.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => hr.removeAttribute(MARKER));
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "carousel-hero": parse2,
    "columns-featured": parse3,
    "cards-article": parse,
    "hero-teaser": parse4
  };
  var transformers = [transform, transform2];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
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
  var import_home_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
