'use strict';
(()=>{
 const bindForms=()=>document.querySelectorAll('form.space-y-4:not([data-mailto-bound])').forEach(form=>{
  form.removeAttribute('onsubmit');form.dataset.mailtoBound='true';
  form.addEventListener('submit',event=>{
   event.preventDefault();if(!form.reportValidity())return;
   const values=[...form.querySelectorAll('input,select,textarea')].filter(el=>el.type!=='submit'&&el.type!=='button'&&el.type!=='checkbox'&&el.type!=='radio').map(el=>{
    const label=el.id?form.querySelector('label[for="'+CSS.escape(el.id)+'"]'):el.parentElement.querySelector('label');
    const title=(label?.textContent||el.name||el.placeholder||'Dato').replace(/\s+/g,' ').replace('*','').trim();
    return title+': '+(el.value||'—');
   });
   const service=form.querySelector('input[readonly]')?.value||form.querySelector('select')?.value||'Conectividad empresarial';
   const name=form.querySelector('input[autocomplete="name"]')?.value||'';
   const subject='Consulta de cotización · '+service+(name?' · '+name:'');
   const body='Hola ISONet Perú,\n\nQuisiera conversar sobre esta necesidad de conectividad:\n\n'+values.join('\n')+'\n\nGracias.';
   const status=document.createElement('p');status.className='official-feedback';status.setAttribute('role','status');status.textContent='Se abrirá tu correo con la consulta preparada para que la revises y la envíes.';
   form.querySelector('.official-feedback')?.remove();form.append(status);
   window.location.href='mailto:isonet@isonetperu.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
 });
 bindForms();document.addEventListener('isonet:navigated',bindForms);
})();
