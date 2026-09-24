const overlay = document.querySelector('.overlay');
if (overlay) {
  const triggers = document.querySelectorAll('.fixed-menu');
  const close = overlay.querySelector('.close');
  let returnFocus;
  const toggle = (open) => {
    if (open) returnFocus = document.activeElement;
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    overlay.inert = !open;
    document.body.classList.toggle('menu-open', open);
    document.querySelector('.fixed-header').inert = open;
    document.body.style.overflow = open ? 'hidden' : '';
    document.querySelector('main').inert = open;
    triggers.forEach(button => button.setAttribute('aria-expanded', String(open)));
    if (open) close.focus();
    else returnFocus?.focus({ preventScroll: true });
  };
  triggers.forEach(button => button.addEventListener('click', () => toggle(true)));
  close.addEventListener('click', () => toggle(false));
  overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', event => {
    if (!overlay.classList.contains('open')) return;
    if (event.key === 'Escape') toggle(false);
    if (event.key === 'Tab') {
      const focusable = [...overlay.querySelectorAll('button, a[href]')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
  document.querySelectorAll('.panel').forEach(slide => {
    if (slide.getBoundingClientRect().top < innerHeight * .92) slide.classList.add('is-visible');
    observer.observe(slide);
  });
  document.documentElement.classList.add('motion-ready');
}

// Native momentum and CSS snap do the scrolling. Some WebKit versions leave a
// scroller between image-panel snap points; correct only after scrolling stops.
const mobileScroller = document.querySelector('main:has(.panel)');
if (mobileScroller) {
  const portrait = matchMedia('(max-width: 999px) and (orientation: portrait)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let touching = false;
  let settleTimer;
  const settle = () => {
    if (!portrait.matches || reducedMotion.matches || touching || document.body.classList.contains('menu-open')) return;
    const max = mobileScroller.scrollHeight - mobileScroller.clientHeight;
    const top = mobileScroller.getBoundingClientRect().top;
    const points = [...mobileScroller.querySelectorAll('.panel')].map(panel =>
      Math.min(max, panel.getBoundingClientRect().top - top + mobileScroller.scrollTop));
    points.push(max); // Keep the final contact/back link reachable.
    const nearest = points.reduce((a, b) => Math.abs(b - mobileScroller.scrollTop) < Math.abs(a - mobileScroller.scrollTop) ? b : a);
    if (Math.abs(nearest - mobileScroller.scrollTop) > 2) mobileScroller.scrollTo({ top: nearest, behavior: 'smooth' });
  };
  const schedule = () => { clearTimeout(settleTimer); settleTimer = setTimeout(settle, 180); };
  mobileScroller.addEventListener('scroll', schedule, { passive: true });
  mobileScroller.addEventListener('scrollend', settle, { passive: true });
  mobileScroller.addEventListener('touchstart', () => { touching = true; clearTimeout(settleTimer); }, { passive: true });
  mobileScroller.addEventListener('touchend', () => { touching = false; schedule(); }, { passive: true });
  mobileScroller.addEventListener('touchcancel', () => { touching = false; schedule(); }, { passive: true });
}
