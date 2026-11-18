'use strict';
document.addEventListener('isonet:navigated',()=>{
 document.querySelectorAll('form').forEach(form=>{form.removeAttribute('onsubmit');form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;let feedback=form.querySelector('.official-feedback');if(!feedback){feedback=document.createElement('p');feedback.className='official-feedback';feedback.setAttribute('role','status');form.append(feedback);}feedback.textContent='Vista previa: los datos están completos. Esta maqueta no envía ni almacena la solicitud. Puedes contactarnos por los teléfonos o correos indicados.';});});

});
/* Interruptible, measured accordion transitions; native details semantics remain intact. */
document.addEventListener('isonet:navigated',()=>{
 const lifecycle=new AbortController();const signal=lifecycle.signal;document.addEventListener('isonet:before-navigate',()=>lifecycle.abort(),{once:true});
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
  reduced.addEventListener('change',()=>{if(reduced.matches&&animation){animation.cancel();finish();}},{signal});
  addEventListener('resize',()=>{if(animation){animation.cancel();finish();}},{passive:true,signal});
 });
});

'use strict';
document.addEventListener('isonet:navigated',()=>{
 // Attach explicit labels and autocomplete without changing contact data or form behavior.
 document.querySelectorAll('form').forEach((form,fi)=>{
  const controls=[...form.querySelectorAll('input,select,textarea')];
  controls.forEach((control,i)=>{if(control.type==='hidden')return;if(!control.id)control.id='propuesta-'+fi+'-'+i;if(!control.name)control.name=control.id;const parent=control.parentElement;const label=parent.querySelector('label');if(label&&!label.htmlFor)label.htmlFor=control.id;
   if(!control.autocomplete){const labelText=(label?.textContent||control.placeholder||'').toLowerCase();if(/nombre/.test(labelText))control.autocomplete='name';else if(/empresa/.test(labelText))control.autocomplete='organization';else if(/localidad|distrito/.test(labelText))control.autocomplete='address-level2';}
  });
 });
 // Keep the floating contact action, show its explanation only on deliberate hover or focus.
 document.querySelectorAll('body>div.fixed .group-hover\\:opacity-100').forEach(x=>x.setAttribute('aria-hidden','true'));
});
