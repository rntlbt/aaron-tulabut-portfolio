const projectsGrid = document.getElementById('projects-grid');
const header = document.querySelector('.site-header');

function renderProjects() {
  projectsGrid.innerHTML = PROJECT_DATA.map((project, index) => `
    <a
      class="project-card reveal"
      href="project.html?id=${encodeURIComponent(project.id)}"
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
        <span class="project-open" aria-hidden="true">&rarr;</span>
      </div>
    </a>
  `).join('');

  attachProjectInteractions();
  observeReveals();
}

function attachProjectInteractions() {
  document.querySelectorAll('.project-card').forEach(card => {
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

async function copyContactValue(button) {
  const value = button.dataset.copyValue;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    button.textContent = 'Copied';
    button.classList.add('is-copied');
    button.setAttribute('aria-label', `Copied ${button.dataset.copyLabel}`);
    clearTimeout(button.copyTimeout);
    button.copyTimeout = setTimeout(() => {
      button.textContent = 'Copy';
      button.classList.remove('is-copied');
      button.setAttribute('aria-label', `Copy ${button.dataset.copyLabel}`);
    }, 1800);
  } catch (error) {
    button.textContent = 'Try again';
    clearTimeout(button.copyTimeout);
    button.copyTimeout = setTimeout(() => {
      button.textContent = 'Copy';
    }, 1800);
  }
}

document.querySelectorAll('.copy-button').forEach(button => {
  button.addEventListener('click', () => copyContactValue(button));
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

renderProjects();
observeReveals();

