const projectDetail = document.getElementById('project-detail');
const projectTitle = document.getElementById('project-title');
const projectSubtitle = document.getElementById('project-subtitle');
const projectYear = document.getElementById('project-year');
const projectDescription = document.getElementById('project-description');
const projectFeatures = document.getElementById('project-features');
const projectStack = document.getElementById('project-stack');
const projectGallery = document.getElementById('project-gallery');
const projectGalleryWrap = document.getElementById('project-gallery-wrap');
const header = document.querySelector('.site-header');
const imageModal = document.getElementById('image-modal');
const imageModalImg = document.getElementById('image-modal-img');
const imageModalCaption = document.getElementById('image-modal-caption');
const imageModalViewport = document.querySelector('.image-modal-viewport');
const imageModalZoom = document.getElementById('image-modal-zoom');
const prevButton = document.querySelector('.image-modal-prev');
const nextButton = document.querySelector('.image-modal-next');
const zoomOutButton = document.querySelector('[data-zoom-out]');
const zoomInButton = document.querySelector('[data-zoom-in]');
const zoomResetButton = document.querySelector('[data-zoom-reset]');

let currentProjectImages = [];
let currentImageIndex = 0;
let lastFocusedElement = null;
let currentZoom = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let pointerStartX = 0;
let pointerStartY = 0;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
const DOUBLE_CLICK_ZOOM = 2;

function renderProjectPage() {
  const params = new URLSearchParams(window.location.search);
  const project = getProjectById(params.get('id')) ?? PROJECT_DATA[0];
  const screenshotGroups = getScreenshotGroups(project);

  document.title = `${project.subtitle} | Aaron Santos Tulabut`;
  projectTitle.textContent = project.title;
  projectSubtitle.textContent = project.subtitle;
  projectYear.textContent = project.year;
  projectDescription.textContent = project.description;
  projectFeatures.innerHTML = project.features.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  projectStack.innerHTML = project.stack.map(item => `<span>${escapeHtml(item)}</span>`).join('');

  currentProjectImages = screenshotGroups.flatMap(group => group.images.map(image => ({ ...image, role: group.role })));
  let imageCounter = 0;
  projectGalleryWrap.hidden = currentProjectImages.length === 0;
  projectGallery.innerHTML = screenshotGroups.map(group => `
    <section class="gallery-role-group" aria-labelledby="gallery-role-${escapeAttribute(project.id)}-${escapeAttribute(slugify(group.role))}">
      <h3 id="gallery-role-${escapeAttribute(project.id)}-${escapeAttribute(slugify(group.role))}" class="gallery-role-title">${escapeHtml(group.role)}</h3>
      <div class="gallery-role-grid">
        ${group.images.map(image => {
          const imageIndex = imageCounter;
          imageCounter += 1;
          return `
            <button class="gallery-item screenshot-button" type="button" data-image-index="${imageIndex}" aria-label="Open screenshot: ${escapeAttribute(image.caption)}">
              <img src="${escapeAttribute(image.src)}" alt="${escapeAttribute(image.alt)}" loading="lazy">
              <span>${escapeHtml(image.caption)}</span>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `).join('');

  document.querySelectorAll('.screenshot-button').forEach(button => {
    button.addEventListener('click', () => openImageModal(Number(button.dataset.imageIndex)));
  });

  observeReveals();
}

function openImageModal(index) {
  if (!currentProjectImages[index]) return;
  lastFocusedElement = document.activeElement;
  currentImageIndex = index;
  resetZoom();
  renderImageModal();
  imageModal.classList.add('is-open');
  imageModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  imageModal.querySelector('.image-modal-close').focus();
}

function closeImageModal() {
  imageModal.classList.remove('is-open');
  imageModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

function renderImageModal() {
  const image = currentProjectImages[currentImageIndex];
  imageModalImg.src = image.src;
  imageModalImg.alt = image.alt;
  imageModalCaption.textContent = image.caption;
  const hasManyImages = currentProjectImages.length > 1;
  prevButton.hidden = !hasManyImages;
  nextButton.hidden = !hasManyImages;
  applyZoom();
}

function showImage(direction) {
  if (currentProjectImages.length < 2) return;
  currentImageIndex = (currentImageIndex + direction + currentProjectImages.length) % currentProjectImages.length;
  resetZoom();
  renderImageModal();
}

function changeZoom(amount, anchorPoint = getViewportCenter()) {
  setZoom(currentZoom + amount, anchorPoint);
}

function setZoom(value, anchorPoint = getViewportCenter()) {
  const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
  if (nextZoom === currentZoom) return;
  zoomTowardPoint(nextZoom, anchorPoint);
  applyZoom();
}

function resetZoom() {
  currentZoom = 1;
  panX = 0;
  panY = 0;
  applyZoom();
}

function applyZoom() {
  if (!imageModalImg || !imageModalZoom || !imageModalViewport) return;
  clampPan();
  imageModalImg.style.transform = `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${currentZoom})`;
  imageModalZoom.textContent = `${Math.round(currentZoom * 100)}%`;
  imageModalViewport.classList.toggle('is-zoomed', currentZoom > 1);
  zoomOutButton.disabled = currentZoom <= MIN_ZOOM;
  zoomInButton.disabled = currentZoom >= MAX_ZOOM;
}

function zoomTowardPoint(nextZoom, anchorPoint) {
  const viewportRect = imageModalViewport.getBoundingClientRect();
  const centerX = viewportRect.width / 2;
  const centerY = viewportRect.height / 2;
  const anchorX = anchorPoint.x - viewportRect.left;
  const anchorY = anchorPoint.y - viewportRect.top;
  const zoomRatio = nextZoom / currentZoom;

  panX += (anchorX - centerX - panX) * (1 - zoomRatio);
  panY += (anchorY - centerY - panY) * (1 - zoomRatio);
  currentZoom = nextZoom;
}

function clampPan() {
  const viewportRect = imageModalViewport.getBoundingClientRect();
  const baseWidth = imageModalImg.offsetWidth;
  const baseHeight = imageModalImg.offsetHeight;
  const maxPanX = Math.max(0, (baseWidth * currentZoom - viewportRect.width) / 2);
  const maxPanY = Math.max(0, (baseHeight * currentZoom - viewportRect.height) / 2);

  panX = Math.min(maxPanX, Math.max(-maxPanX, panX));
  panY = Math.min(maxPanY, Math.max(-maxPanY, panY));
}

function getViewportCenter() {
  const rect = imageModalViewport.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function getPointerPoint(event) {
  return { x: event.clientX, y: event.clientY };
}

document.querySelectorAll('[data-close-image-modal]').forEach(button => {
  button.addEventListener('click', closeImageModal);
});

imageModalImg.draggable = false;
imageModalImg.addEventListener('load', applyZoom);
prevButton.addEventListener('click', () => showImage(-1));
nextButton.addEventListener('click', () => showImage(1));
zoomOutButton.addEventListener('click', () => changeZoom(-ZOOM_STEP));
zoomInButton.addEventListener('click', () => changeZoom(ZOOM_STEP));
zoomResetButton.addEventListener('click', resetZoom);

imageModalViewport.addEventListener('wheel', event => {
  if (!imageModal.classList.contains('is-open')) return;
  event.preventDefault();
  changeZoom(event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP, getPointerPoint(event));
}, { passive: false });

imageModalViewport.addEventListener('dblclick', event => {
  event.preventDefault();
  if (currentZoom > 1) {
    resetZoom();
    return;
  }

  setZoom(DOUBLE_CLICK_ZOOM, getPointerPoint(event));
});

imageModalViewport.addEventListener('pointerdown', event => {
  if (currentZoom <= 1) return;
  isPanning = true;
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  panStartX = panX;
  panStartY = panY;
  imageModalViewport.setPointerCapture(event.pointerId);
  imageModalViewport.classList.add('is-panning');
});

imageModalViewport.addEventListener('pointermove', event => {
  if (!isPanning) return;
  panX = panStartX + event.clientX - pointerStartX;
  panY = panStartY + event.clientY - pointerStartY;
  applyZoom();
});

function endPan(event) {
  if (!isPanning) return;
  isPanning = false;
  imageModalViewport.classList.remove('is-panning');
  if (imageModalViewport.hasPointerCapture(event.pointerId)) {
    imageModalViewport.releasePointerCapture(event.pointerId);
  }
}

imageModalViewport.addEventListener('pointerup', endPan);
imageModalViewport.addEventListener('pointercancel', endPan);

document.addEventListener('keydown', event => {
  if (!imageModal.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeImageModal();
  if (event.key === 'ArrowLeft') showImage(-1);
  if (event.key === 'ArrowRight') showImage(1);
  if (event.key === '+' || event.key === '=') changeZoom(ZOOM_STEP);
  if (event.key === '-' || event.key === '_') changeZoom(-ZOOM_STEP);
  if (event.key === '0') resetZoom();
});

function observeReveals() {
  const revealItems = document.querySelectorAll('.reveal:not([data-observed])');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.dataset.observed = 'true';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach(item => observer.observe(item));
}

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'screenshots';
}

renderProjectPage();
