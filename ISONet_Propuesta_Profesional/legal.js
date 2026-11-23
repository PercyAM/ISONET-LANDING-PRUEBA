(()=>{
 const key='isonet-cookie-preferences-v1';
 const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}};
 const form=document.getElementById('cookie-preferences');
 if(!form)return;
 const saved=read();form.elements.analytics.checked=Boolean(saved.analytics);form.elements.marketing.checked=Boolean(saved.marketing);
 form.addEventListener('submit',event=>{event.preventDefault();const choice={essential:true,analytics:form.elements.analytics.checked,marketing:form.elements.marketing.checked,savedAt:new Date().toISOString()};try{localStorage.setItem(key,JSON.stringify(choice));document.getElementById('cookie-status').textContent='Preferencias guardadas en este navegador. No se han enviado a ISONet.'}catch{document.getElementById('cookie-status').textContent='El navegador no permitió guardar la preferencia. Puedes cambiar el almacenamiento desde su configuración.'}});
 document.getElementById('reset-cookie-preferences')?.addEventListener('click',()=>{form.elements.analytics.checked=false;form.elements.marketing.checked=false;try{localStorage.removeItem(key);document.getElementById('cookie-status').textContent='Preferencias restablecidas en este navegador.'}catch{document.getElementById('cookie-status').textContent='No se pudo restablecer el almacenamiento local.'}});
})();

// Local-only interaction for the Libro de Reclamaciones prototype.
(()=>{
 const form=document.getElementById('complaint-form');
 if(!form)return;
 const date=document.getElementById('complaint-date');
 if(date){const now=new Date();date.value=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10)}
 const minor=document.getElementById('complainant-minor');
 const rep=document.getElementById('representative-fields');
 const repName=form.elements['representative-name'];
 const repDocument=form.elements['representative-document'];
 const syncRepresentative=()=>{
  const visible=Boolean(minor?.checked);
  rep.hidden=!visible;
  if(repName)repName.required=visible;
  if(repDocument)repDocument.required=visible;
 };
 minor?.addEventListener('change',syncRepresentative);
 syncRepresentative();
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const status=document.getElementById('complaint-status');
  if(!status)return;
  status.textContent='Prototipo: el formulario se validó en esta pantalla, pero tus datos no se enviaron ni se guardaron. El Libro de Reclamaciones aún no está habilitado.';
 });
})();
