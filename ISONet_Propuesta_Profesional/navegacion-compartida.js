'use strict';
(()=>{
 const update=()=>document.body.classList.toggle('header-is-scrolled',window.scrollY>24);
 update();window.addEventListener('scroll',update,{passive:true});document.addEventListener('isonet:navigated',update);
})();
let cleanupReveal=()=>{};
function initializeReveal(){
 cleanupReveal();
 const lifecycle=new AbortController();const signal=lifecycle.signal;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||!('IntersectionObserver' in window))return;
 const candidates=[...document.querySelectorAll('main h1, main h2, main h3, main p')].filter(el=>!el.closest('form,details,[aria-live],svg,.solution-tile,.home-service,.professional-facts,.bg-surface-container-lowest,.official-process li'));
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('isonet-pending');observer.unobserve(entry.target)}}),{threshold:0,rootMargin:'0px 0px 32px 0px'});
 candidates.forEach(el=>{const rect=el.getBoundingClientRect();if(rect.top<innerHeight||rect.height===0)return;el.classList.add('isonet-reveal','isonet-pending');observer.observe(el)});
 const showAll=()=>{candidates.forEach(el=>el.classList.remove('isonet-pending'));observer.disconnect()};
 document.addEventListener('focusin',event=>event.target.closest('section')?.querySelectorAll('.isonet-pending').forEach(el=>{el.classList.remove('isonet-pending');observer.unobserve(el)}),{signal});
 document.addEventListener('keydown',event=>{if(event.key==='Tab')showAll()},{signal});
 reduced.addEventListener('change',event=>{if(event.matches)showAll()},{signal});
 addEventListener('pageshow',event=>{if(event.persisted)showAll()},{signal});
 cleanupReveal=()=>{observer.disconnect();lifecycle.abort()};
}
initializeReveal();
document.addEventListener('isonet:navigated',initializeReveal);
document.addEventListener('isonet:before-navigate',()=>cleanupReveal());
let fiberObserver;
function initializeFibers(){
 fiberObserver?.disconnect();const fibers=document.querySelector('.official-fiber-slogan');if(!fibers)return;
 if('IntersectionObserver' in window){fiberObserver=new IntersectionObserver(entries=>entries.forEach(entry=>fibers.classList.toggle('fiber-active',entry.isIntersecting)),{threshold:.05});fiberObserver.observe(fibers)}else fibers.classList.add('fiber-active');
}
initializeFibers();document.addEventListener('isonet:navigated',initializeFibers);
document.addEventListener('isonet:before-navigate',()=>fiberObserver?.disconnect());
(()=>{
 const body=document.body;
 const header=document.querySelector('.official-header');
 if(!header)return;
 let previousY=Math.max(0,window.scrollY);
 const menuIsOpen=()=>header.querySelector('.official-menu-toggle')?.getAttribute('aria-expanded')==='true'||header.querySelector('.official-solutions-toggle')?.getAttribute('aria-expanded')==='true';
 const syncCurrent=()=>{
  const current=decodeURIComponent(location.pathname.split('/').pop()||'index.html');
  let selected=false;
  header.querySelectorAll('#official-dropdown a[href]').forEach(link=>{
   const target=decodeURIComponent(new URL(link.href,location.href).pathname.split('/').pop()||'index.html');
   const active=target===current;
   link.classList.toggle('is-current',active);
   if(active){link.setAttribute('aria-current','page');selected=true}else link.removeAttribute('aria-current');
  });
  const services=header.querySelector('.official-solutions-link');
  services?.classList.toggle('is-current',current==='index.html'||selected);
 };
 const onScroll=()=>{
  const y=Math.max(0,window.scrollY);
  const delta=y-previousY;
  if(y<110||delta < -5||menuIsOpen())body.classList.remove('navbar-hidden');
  else if(delta>7&&y>145)body.classList.add('navbar-hidden');
  previousY=y;
 };
 syncCurrent();
 window.addEventListener('scroll',onScroll,{passive:true});
 window.addEventListener('popstate',syncCurrent);
 document.addEventListener('isonet:navigated',()=>{body.classList.remove('navbar-hidden');previousY=Math.max(0,window.scrollY);syncCurrent()});
 document.addEventListener('focusin',event=>{if(header.contains(event.target))body.classList.remove('navbar-hidden')});
})();

// Ease discrete mouse-wheel steps. Continuous wheel input stays with the browser.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let destination = 0;
  let lastTime = 0;
  let direction = 0;

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function step(time) {
    const current = window.scrollY;
    const remaining = destination - current;
    if (Math.abs(remaining) < 1) {
      window.scrollTo({ top: destination, behavior: 'instant' });
      frame = 0;
      return;
    }

    const elapsed = Math.max(0, Math.min(time - lastTime, 40));
    lastTime = time;
    const advance = Math.max(1, Math.round(Math.abs(remaining) * (1 - Math.exp(-elapsed / 105))));
    const top = current + Math.sign(remaining) * Math.min(advance, Math.abs(remaining));
    window.scrollTo({ top, behavior: 'instant' });
    frame = requestAnimationFrame(step);
  }

  window.addEventListener('wheel', event => {
    const mode = event.deltaMode;
    const delta = event.deltaY;
    const discrete = mode === 1 || (mode === 0 && Math.abs(delta) >= 80 && delta % 20 === 0);
    if (!document.body.matches('[data-home-design][data-ux-polish]') || reducedMotion.matches ||
        !discrete || !event.cancelable || event.defaultPrevented || event.ctrlKey || event.shiftKey ||
        !delta || Math.abs(event.deltaX) >= Math.abs(delta)) {
      stop();
      return;
    }

    for (let element = event.target instanceof Element ? event.target : null;
         element && element !== document.body; element = element.parentElement) {
      if (element.matches('input, textarea, select, [contenteditable]') ||
          (element.scrollHeight > element.clientHeight && /auto|scroll/.test(getComputedStyle(element).overflowY))) {
        stop();
        return;
      }
    }

    const nextDirection = Math.sign(delta);
    const current = window.scrollY;
    const distance = (mode === 1 ? delta * 24 : delta) * .72;
    const maximum = document.scrollingElement.scrollHeight - innerHeight;
    const base = frame && direction === nextDirection ? destination : current;
    destination = Math.round(Math.max(0, Math.min(maximum, current + Math.max(-480, Math.min(480, base + distance - current)))));
    if (destination === current) {
      stop();
      return;
    }

    event.preventDefault();
    direction = nextDirection;
    if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(step);
    }
  }, { passive: false });

  for (const event of ['keydown', 'pointerdown', 'touchstart', 'hashchange']) {
    window.addEventListener(event, stop, { passive: true });
  }
  document.addEventListener('isonet:before-navigate', stop);
  reducedMotion.addEventListener('change', stop);
})();

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px)');
  const slides = new Set();
  let observer;

  function cancelSlides() {
    for (const slide of slides) slide.cancel();
    slides.clear();
  }

  function initializeSlides() {
    observer?.disconnect();
    cancelSlides();
    if (reduced.matches || !('IntersectionObserver' in window) ||
        !document.body.matches('[data-home-design][data-ux-polish]')) return;

    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reduced.matches || entry.boundingClientRect.top < innerHeight * .35 ||
            entry.target.contains(document.activeElement)) continue;

        const slide = entry.target.animate([
          { transform: desktop.matches ? 'translate(28px, -12px)' : 'translate(12px, -5px)' },
          { transform: 'none' }
        ], {
          duration: desktop.matches ? 380 : 270,
          easing: 'cubic-bezier(.22, 1, .36, 1)'
        });
        slides.add(slide);
        slide.finished.then(() => slides.delete(slide), () => slides.delete(slide));
      }
    });

    for (const section of document.querySelectorAll('main :is(#cobertura, #soporte)')) {
      if (section.getBoundingClientRect().top >= innerHeight) observer.observe(section);
    }
  }

  initializeSlides();
  document.addEventListener('isonet:navigated', initializeSlides);
  document.addEventListener('isonet:before-navigate', () => {
    observer?.disconnect();
    cancelSlides();
  });
  document.addEventListener('focusin', cancelSlides);
  window.addEventListener('hashchange', cancelSlides);
  reduced.addEventListener('change', initializeSlides);
})();

document.addEventListener('click', event => {
  const button = event.target.closest('[data-solution-step]');
  if (!button) return;
  const track = document.getElementById(button.getAttribute('aria-controls'));
  const [first, second] = track?.children ?? [];
  if (!first || !second) return;

  const distance = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  track.scrollBy({
    left: distance * Number(button.dataset.solutionStep),
    behavior: reduce ? 'instant' : 'smooth'
  });
});

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = () => {};

  function initializeCarousel() {
    cleanup();
    const track = document.getElementById('solution-carousel');
    if (!track || !('IntersectionObserver' in window)) return;

    const controller = new AbortController();
    const { signal } = controller;
    let visible = false;
    let frame = 0;
    let previousTime;
    let position = track.scrollLeft;
    let direction = 1;
    let manualUntil = 0;

    function updatePlayback() {
      cancelAnimationFrame(frame);
      previousTime = undefined;
      position = track.scrollLeft;
      const animate = visible && !document.hidden && !reducedMotion.matches;
      track.classList.toggle('is-auto-scrolling', animate);
      if (animate) frame = requestAnimationFrame(advance);
    }

    function advance(time) {
      const elapsed = Math.min(time - (previousTime ?? time), 40);
      previousTime = time;
      const limit = track.scrollWidth - track.clientWidth;
      if (time < manualUntil || track.contains(document.activeElement) || limit <= 0) {
        position = track.scrollLeft;
      } else {
        if (position >= limit) direction = -1;
        else if (position <= 0) direction = 1;
        position = Math.max(0, Math.min(limit, position + direction * elapsed * .026));
        track.scrollLeft = position;
      }
      frame = requestAnimationFrame(advance);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(track);

    track.closest('section').addEventListener('click', event => {
      if (event.target.closest('[data-solution-step]')) manualUntil = performance.now() + 900;
    }, { signal });
    document.addEventListener('visibilitychange', updatePlayback, { signal });
    reducedMotion.addEventListener('change', updatePlayback, { signal });

    cleanup = () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      track.classList.remove('is-auto-scrolling');
      controller.abort();
    };
  }

  initializeCarousel();
  document.addEventListener('isonet:navigated', initializeCarousel);
  document.addEventListener('isonet:before-navigate', () => cleanup());
})();
