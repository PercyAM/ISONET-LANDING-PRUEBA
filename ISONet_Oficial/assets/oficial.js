'use strict';
(()=>{
 const menu=document.getElementById('official-menu'),toggle=document.querySelector('.official-menu-toggle'),group=document.querySelector('.official-solutions'),solutions=document.querySelector('.official-solutions-toggle');
 const setMenu=open=>{menu.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');};
 const setSolutions=open=>{group.classList.toggle('is-open',open);solutions.setAttribute('aria-expanded',String(open));};
 toggle.addEventListener('click',()=>setMenu(!menu.classList.contains('is-open')));solutions.addEventListener('click',()=>setSolutions(!group.classList.contains('is-open')));
 group.addEventListener('pointerenter',()=>{if(matchMedia('(min-width:901px) and (hover:hover)').matches)setSolutions(true);});group.addEventListener('pointerleave',()=>{if(!group.contains(document.activeElement))setSolutions(false);});group.addEventListener('focusout',()=>setTimeout(()=>{if(!group.contains(document.activeElement))setSolutions(false);},0));
 document.addEventListener('click',e=>{if(!e.target.closest('.official-header')){setMenu(false);setSolutions(false);}if(e.target.closest('.official-header a')){setMenu(false);setSolutions(false);}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasOpen=group.classList.contains('is-open');setSolutions(false);if(wasOpen)solutions.focus();else{setMenu(false);toggle.focus();}}if(e.key==='ArrowDown'&&e.target===solutions){e.preventDefault();setSolutions(true);group.querySelector('a').focus();}});
 matchMedia('(min-width:901px)').addEventListener('change',()=>{setMenu(false);setSolutions(false);});
 document.querySelectorAll('form').forEach(form=>{form.removeAttribute('onsubmit');form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;let feedback=form.querySelector('.official-feedback');if(!feedback){feedback=document.createElement('p');feedback.className='official-feedback';feedback.setAttribute('role','status');form.append(feedback);}feedback.textContent='Vista previa: los datos están completos. Esta maqueta no envía ni almacena la solicitud. Puedes contactarnos por los teléfonos o correos indicados.';});});
 const skip=document.createElement('a');skip.className='official-skip';skip.href='#contenido';skip.textContent='Saltar al contenido';document.body.prepend(skip);document.querySelector('main').id='contenido';
 document.querySelectorAll('a[href="#"]').forEach(a=>{a.href=a.textContent.includes('Soluciones')?'index.html#soluciones':'#cotizar';});
})();
/* Interruptible, measured accordion transitions; native details semantics remain intact. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.official-questions details').forEach(details=>{
  const summary=details.querySelector('summary');let animation=null,wanted=details.open;
  const finish=()=>{const completed=animation;animation=null;if(completed){completed.onfinish=null;completed.cancel();}details.open=wanted;details.style.height='';details.style.overflow='';};
  summary.addEventListener('click',event=>{
   if(reduced.matches||event.detail===0)return;
   event.preventDefault();wanted=!wanted;
   const start=details.getBoundingClientRect().height;
   if(animation){animation.oncancel=null;animation.cancel();animation=null;}
   details.style.height='';details.style.overflow='hidden';details.open=true;
   const end=wanted?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+2;
   details.style.height=start+'px';
   animation=details.animate([{height:start+'px'},{height:end+'px'}],{duration:240,easing:'cubic-bezier(.23,1,.32,1)',fill:'forwards'});
   animation.onfinish=finish;
  });
  summary.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&animation){animation.cancel();animation=null;details.style.height='';details.style.overflow='';wanted=details.open;}});
  details.addEventListener('toggle',()=>{if(!animation)wanted=details.open;});
  reduced.addEventListener('change',()=>{if(reduced.matches&&animation){animation.cancel();finish();}});
  addEventListener('resize',()=>{if(animation){animation.cancel();finish();}},{passive:true});
 });
})();
