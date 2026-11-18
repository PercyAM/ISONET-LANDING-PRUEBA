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