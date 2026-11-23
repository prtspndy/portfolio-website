const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menu-icon');

if (nav && menu) {
  const setNavigationOpen = (open) => {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menuIcon) menuIcon.textContent = open ? '×' : '☰';
  };

  menu.addEventListener('click', () => {
    setNavigationOpen(menu.getAttribute('aria-expanded') !== 'true');
  });

  document.querySelectorAll('#primary-navigation a').forEach((link) => {
    link.addEventListener('click', () => setNavigationOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setNavigationOpen(false);
      menu.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (menu.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target)) {
      setNavigationOpen(false);
    }
  });

  window.matchMedia('(min-width: 681px)').addEventListener('change', (event) => {
    if (event.matches) setNavigationOpen(false);
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const glow = document.querySelector('.cursor-glow');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (glow && finePointer.matches && !reducedMotion) {
  let pointerX = 0;
  let pointerY = 0;
  let framePending = false;

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
        framePending = false;
      });
    }
  }, { passive: true });
}

if (!reducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach((element) => reveal.observe(element));
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const projectFilters = document.querySelectorAll('.project-filter');
const projects = document.querySelectorAll('.work-grid .project');
const filterStatus = document.querySelector('.filter-status');

projectFilters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    projectFilters.forEach((filterButton) => {
      const active = filterButton === button;
      filterButton.classList.toggle('is-active', active);
      filterButton.setAttribute('aria-pressed', String(active));
    });

    projects.forEach((project) => {
      const visible = filter === 'all' || project.dataset.category === filter;
      project.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (filterStatus) {
      filterStatus.textContent = filter === 'all'
        ? `Showing all ${visibleCount} projects`
        : `Showing ${visibleCount} ${filter} ${visibleCount === 1 ? 'project' : 'projects'}`;
    }
  });
});
