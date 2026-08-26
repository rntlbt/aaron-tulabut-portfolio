/*
  PORTFOLIO DATA MODEL
  --------------------
  This is intentionally centralized so the portfolio can grow without rewriting the UI logic.

  ADDING A NEW PROJECT:
  1. Duplicate one object inside PROJECT_DATA.
  2. Change `id`, `title`, `subtitle`, `year`, `description`, `features`, `stack`, and `images`.
  3. Create a matching image folder at:
       assets/images/projects/<your-project-folder>/
  4. Put your screenshots there.
  5. In `images`, add one entry per screenshot:
       { src: "assets/images/projects/<folder>/01-dashboard.jpg", caption: "Dashboard", alt: "Project dashboard screenshot" }
  6. No other JavaScript changes are required.

  PLACEHOLDER PROJECT:
  The second project below is a placeholder because its actual content was not supplied in the current conversation.
  Replace its values rather than inventing project details.
*/
const PROJECT_DATA = [
  {
    id: 'simon-dost3',
    title: 'Smart ICT Management and Operations Network System for DOST Region III',
    subtitle: 'SIMON-DOST3',
    year: '2026',
    description: 'A web-based ICT management system for asset tracking, repair and borrowing workflows, preventive maintenance, role-based access, and predictive maintenance.',
    features: [
      'ICT asset tracking and inventory management',
      'Repair and borrowing workflows',
      'Preventive maintenance support',
      'Role-based access and system workflows',
      'Predictive models integrated through FastAPI'
    ],
    stack: ['Laravel', 'PostgreSQL', 'Inertia', 'FastAPI'],
    images: [
      { src: 'assets/images/projects/simon-dost3/01-placeholder.jpg', caption: 'Replace with a SIMON-DOST3 screenshot', alt: 'SIMON-DOST3 screenshot placeholder' },
      { src: 'assets/images/projects/simon-dost3/02-placeholder.jpg', caption: 'Replace with another SIMON-DOST3 screenshot', alt: 'SIMON-DOST3 second screenshot placeholder' },
      { src: 'assets/images/projects/simon-dost3/03-placeholder.jpg', caption: 'Replace with another SIMON-DOST3 screenshot', alt: 'SIMON-DOST3 third screenshot placeholder' }
    ]
  },
  {
    id: 'project-2',
    title: 'Your Second Project',
    subtitle: 'Project placeholder',
    year: 'YEAR',
    description: 'Replace this placeholder with the real purpose and a concise summary of your second project.',
    features: [
      'Replace with a real feature or problem solved',
      'Replace with another notable capability',
      'Replace with the project outcome or purpose'
    ],
    stack: ['Technology', 'Technology'],
    images: [
      { src: 'assets/images/projects/project-2/01-placeholder.jpg', caption: 'Add a project screenshot', alt: 'Project screenshot placeholder' }
    ],
    placeholder: true
  }
];

const projectsGrid = document.getElementById('projects-grid');
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalYear = document.getElementById('modal-year');
const modalDescription = document.getElementById('modal-description');
const modalFeatures = document.getElementById('modal-features');
const modalStack = document.getElementById('modal-stack');
const modalGallery = document.getElementById('modal-gallery');
const header = document.querySelector('.site-header');
let lastFocusedElement = null;

function renderProjects() {
  projectsGrid.innerHTML = PROJECT_DATA.map((project, index) => `
    <article
      class="project-card reveal"
      data-project-id="${escapeAttribute(project.id)}"
      data-placeholder="${project.placeholder ? 'true' : 'false'}"
      tabindex="0"
      role="button"
      aria-label="Open project details for ${escapeAttribute(project.title)}"
    >
      <div class="project-card-top">
        <span class="project-index">0${index + 1}</span>
        <span class="project-year">${escapeHtml(project.year)}</span>
      </div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="project-card-footer">
        <div class="project-stack">
          <div class="tag-list">
            ${project.stack.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
          </div>
        </div>
        <span class="project-open" aria-hidden="true">↗</span>
      </div>
    </article>
  `).join('');

  attachProjectInteractions();
  observeReveals();
}

function attachProjectInteractions() {
  document.querySelectorAll('.project-card').forEach(card => {
    const open = () => openProject(card.dataset.projectId);
    card.addEventListener('click', open);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });

    if (!window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    }
  });
}

function openProject(projectId) {
  const project = PROJECT_DATA.find(item => item.id === projectId);
  if (!project) return;
  lastFocusedElement = document.activeElement;
  modalTitle.textContent = project.title;
  modalSubtitle.textContent = project.subtitle;
  modalYear.textContent = project.year;
  modalDescription.textContent = project.description;
  modalFeatures.innerHTML = project.features.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  modalStack.innerHTML = project.stack.map(item => `<span>${escapeHtml(item)}</span>`).join('');
  modalGallery.innerHTML = project.images.map(image => `
    <figure class="gallery-item">
      <img src="${escapeAttribute(image.src)}" alt="${escapeAttribute(image.alt)}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false;">
      <div class="placeholder-image" hidden>Image placeholder<br><small>${escapeHtml(image.caption)}</small></div>
      <figcaption>${escapeHtml(image.caption)}</figcaption>
    </figure>
  `).join('');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll('[data-close-modal]').forEach(button => {
  button.addEventListener('click', closeModal);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
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
function escapeAttribute(value) { return escapeHtml(value); }

renderProjects();
observeReveals();
