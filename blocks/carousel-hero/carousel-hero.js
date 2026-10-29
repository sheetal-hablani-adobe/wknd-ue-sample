import { moveInstrumentation } from '../../scripts/scripts.js';

const LABELS = {
  roleDescription: 'Carousel',
  controls: 'Carousel Slide Controls',
  previous: 'Previous Slide',
  next: 'Next Slide',
  show: 'Show Slide',
  of: 'of',
};

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-hero');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  block.querySelectorAll('.carousel-hero-slide').forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });

  block.querySelectorAll('.carousel-hero-slide-indicator').forEach((indicator, idx) => {
    const button = indicator.querySelector('button');
    if (idx !== slideIndex) button.removeAttribute('disabled');
    else button.setAttribute('disabled', 'true');
  });
}

function showSlide(block, slideIndex = 0, behavior = 'smooth') {
  const slides = block.querySelectorAll('.carousel-hero-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-hero-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior,
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-hero-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.carousel-hero-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide || 0, 10) - 1);
  });
  block.querySelector('.carousel-hero-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide || 0, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-hero-slide').forEach((slide) => slideObserver.observe(slide));
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.id = `carousel-hero-${carouselId}-slide-${slideIndex}`;
  slide.classList.add('carousel-hero-slide');

  [...row.children].forEach((column) => {
    const isImage = column.querySelector('picture, img') && !column.textContent.trim();
    column.classList.add(isImage ? 'carousel-hero-slide-image' : 'carousel-hero-slide-content');
    slide.append(column);
  });

  const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    if (!heading.id) heading.id = `${slide.id}-title`;
    slide.setAttribute('aria-labelledby', heading.id);
  }

  return slide;
}

let carouselId = 0;

/**
 * Hero carousel: one row per slide (image cell, content cell).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  carouselId += 1;
  block.id = `carousel-hero-${carouselId}`;
  const rows = [...block.querySelectorAll(':scope > div')];
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', LABELS.roleDescription);

  const container = document.createElement('div');
  container.classList.add('carousel-hero-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-hero-slides');

  let slideIndicators;
  let indicatorsNav;
  if (!isSingleSlide) {
    indicatorsNav = document.createElement('nav');
    indicatorsNav.setAttribute('aria-label', LABELS.controls);
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-hero-slide-indicators');
    indicatorsNav.append(slideIndicators);

    const navButtons = document.createElement('div');
    navButtons.classList.add('carousel-hero-navigation-buttons');
    navButtons.innerHTML = `
      <button type="button" class="carousel-hero-prev" aria-label="${LABELS.previous}"></button>
      <button type="button" class="carousel-hero-next" aria-label="${LABELS.next}"></button>
    `;
    container.append(navButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-hero-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${LABELS.show} ${idx + 1} ${LABELS.of} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.prepend(slidesWrapper);
  block.prepend(container);
  if (indicatorsNav) block.append(indicatorsNav);

  if (!isSingleSlide) bindEvents(block);
}
