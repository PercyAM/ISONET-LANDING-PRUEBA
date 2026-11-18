'use strict';
(()=>{
 // Attach explicit labels and autocomplete without changing contact data or form behavior.
 document.querySelectorAll('form').forEach((form,fi)=>{
  const controls=[...form.querySelectorAll('input,select,textarea')];
  controls.forEach((control,i)=>{if(control.type==='hidden')return;if(!control.id)control.id='propuesta-'+fi+'-'+i;if(!control.name)control.name=control.id;const parent=control.parentElement;const label=parent.querySelector('label');if(label&&!label.htmlFor)label.htmlFor=control.id;
   if(!control.autocomplete){const labelText=(label?.textContent||control.placeholder||'').toLowerCase();if(/nombre/.test(labelText))control.autocomplete='name';else if(/empresa/.test(labelText))control.autocomplete='organization';else if(/localidad|distrito/.test(labelText))control.autocomplete='address-level2';}
  });
 });
 // Keep the floating contact action, show its explanation only on deliberate hover or focus.
 document.querySelectorAll('body>div.fixed .group-hover\\:opacity-100').forEach(x=>x.setAttribute('aria-hidden','true'));
})();
