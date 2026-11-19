(()=>{
 const key='isonet-cookie-preferences-v1';
 const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
 const save=analytics=>{const choice={essential:true,analytics,marketing:analytics,savedAt:new Date().toISOString()};try{localStorage.setItem(key,JSON.stringify(choice))}catch{try{sessionStorage.setItem(key,JSON.stringify(choice))}catch{}}};
 function mount(){
  let banner=document.querySelector('.isonet-cookie-banner');
  if(!banner){banner=document.createElement('aside');banner.className='isonet-cookie-banner';banner.setAttribute('aria-label','Preferencias de cookies');banner.innerHTML='<p class="isonet-cookie-copy">Usamos almacenamiento local para recordar tus preferencias. En esta maqueta no hay cookies de analítica o publicidad activas; el sitio funciona sin ellas. Puedes aceptar o rechazar las categorías opcionales. <a href="privacidad.html#cookies">Más información</a></p><div class="isonet-cookie-actions"><button type="button" class="isonet-cookie-reject">Rechazar</button><button type="button" class="isonet-cookie-accept">Aceptar</button></div>';document.body.append(banner);}
  const existing=read();banner.hidden=Boolean(existing);
  if(banner.dataset.bound)return;banner.dataset.bound='true';
  banner.querySelector('.isonet-cookie-reject').addEventListener('click',()=>{save(false);banner.hidden=true});
  banner.querySelector('.isonet-cookie-accept').addEventListener('click',()=>{save(true);banner.hidden=true});
 }
 mount();document.addEventListener('isonet:navigated',mount);
})();
