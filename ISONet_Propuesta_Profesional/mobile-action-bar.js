(()=>{
 const mount=()=>{
  if(document.querySelector('.mobile-action-bar'))return;
  const quote=document.querySelector('#cotizar')?'#cotizar':'index.html#cotizar';
  const bar=document.createElement('nav');bar.className='mobile-action-bar';bar.setAttribute('aria-label','Acciones rápidas');
  bar.innerHTML='<a class="mobile-action-bar__quote" href="'+quote+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 13h5"/></svg><span>Cotizar</span></a><a class="mobile-action-bar__whatsapp" href="https://wa.me/51988118021?text=Hola%20ISONet%20Per%C3%BA,%20deseo%20consultar%20sobre%20sus%20servicios." target="_blank" rel="noopener noreferrer" aria-label="Contactar a ISONet Perú por WhatsApp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9 9c.6 2.2 2.1 3.7 4.3 4.4l1.2-1.2 2 1v1.2c0 .6-.5 1-1 1-4.4-.4-7.6-3.6-8-8 0-.6.4-1 1-1h1.2l1 2L9 9Z"/></svg><span>WhatsApp</span></a>';
  document.body.append(bar);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
 document.addEventListener('isonet:navigated',mount);
})();
