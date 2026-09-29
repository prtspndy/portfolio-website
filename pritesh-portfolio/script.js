const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');

const setNavigationOpen = (open) => {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
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
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        );
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.project,.skill-group,.timeline-item,.facts > div,.about-content')
    .forEach((element) => reveal.observe(element));
}
