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
 const candidates=[...document.querySelectorAll('main h1, main h2, main h3, main p')].filter(el=>!el.closest('form,details,[aria-live],svg,.home-service,.professional-facts,.bg-surface-container-lowest,.official-process li'));
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
