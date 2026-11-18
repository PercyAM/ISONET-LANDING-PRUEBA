'use strict';
/* Progressive partial navigation: ordinary links remain the fallback. */
(()=>{
 if(!/^https?:$/.test(location.protocol)||!window.fetch||!window.DOMParser)return;
 const names=new Set(['index.html','linea-dedicada.html','transporte-datos.html','internet-satelital.html','telefonia-ip.html','enlaces-digitales.html']);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const cache=new Map();let navigationId=0;let current=location.href;let saving=false;
 const position=()=>({x:scrollX,y:scrollY});
 const save=()=>history.replaceState({...history.state,isonetScroll:position()},'',location.href);
 history.scrollRestoration='manual';save();
 addEventListener('scroll',()=>{if(!saving){saving=true;requestAnimationFrame(()=>{save();saving=false})}},{passive:true});
 const local=url=>url.origin===location.origin&&url.pathname.slice(0,url.pathname.lastIndexOf('/')+1)===location.pathname.slice(0,location.pathname.lastIndexOf('/')+1)&&names.has(url.pathname.split('/').pop());
 const load=url=>{
  const key=url.origin+url.pathname+url.search;
  if(!cache.has(key)){
   const request=fetch(key,{credentials:'same-origin'}).then(async response=>{
    if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))throw Error('Invalid route response');
    const doc=new DOMParser().parseFromString(await response.text(),'text/html');
    if(!doc.querySelector('main')||!doc.querySelector('.official-header'))throw Error('Incomplete route');
    return doc;
   }).catch(error=>{cache.delete(key);throw error});
   cache.set(key,request);if(cache.size>6)cache.delete(cache.keys().next().value);
  }
  return cache.get(key);
 };
 const styles=async(doc,url)=>{
  const staged=[];
  for(const source of doc.querySelectorAll('link[rel="stylesheet"]')){
   const href=new URL(source.getAttribute('href'),url).href;
   if(new URL(href).origin!==location.origin){
    if(![...document.querySelectorAll('link[rel="stylesheet"]')].some(link=>link.href===href)){
     const font=source.cloneNode();font.href=href;document.head.append(font);
    }
    continue;
   }
   // Fonts are shared and retained; local page styles are staged without affecting the old page.
   const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.media='not all';link.dataset.routeStyle='';
   staged.push(link);
  }
  await Promise.all(staged.map(link=>new Promise((resolve,reject)=>{
   link.onload=resolve;link.onerror=()=>reject(Error('Stylesheet failed: '+link.href));document.head.append(link);
  })) ).catch(error=>{staged.forEach(link=>link.remove());throw error});
  return staged;
 };
 const markActive=()=>{
  const header=document.querySelector('.official-header');
  header.querySelectorAll('a[aria-current]').forEach(a=>a.removeAttribute('aria-current'));
  if(location.pathname.endsWith('/index.html')){
   const target=location.hash&&header.querySelector('a[href="index.html'+location.hash+'"],a[href="'+location.hash+'"]');
   if(target)target.setAttribute('aria-current','location');
  }else header.querySelectorAll('#official-dropdown a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page')});
  header.querySelector('.official-solutions-link').href=new URL('index.html#soluciones',location.href).href;
 };
 const scrollToRoute=(url,restored)=>{
  const saved=document.documentElement.style.scrollBehavior;document.documentElement.style.scrollBehavior='auto';
  if(restored)window.scrollTo({left:restored.x,top:restored.y,behavior:'instant'});
  else if(url.hash){let id;try{id=decodeURIComponent(url.hash.slice(1))}catch{id=url.hash.slice(1)};document.getElementById(id)?.scrollIntoView({behavior:'instant'});}
  else window.scrollTo({top:0,left:0,behavior:'instant'});
  document.documentElement.style.scrollBehavior=saved;
 };
 async function navigate(url,{pop=false,restored=null,keyboard=false}={}){
  const id=++navigationId;
  try{
   const doc=await load(url);if(id!==navigationId)return;
   const oldStyles=[...document.querySelectorAll('link[rel="stylesheet"]')].filter(link=>new URL(link.href).origin===location.origin);
   const staged=await styles(doc,url);if(id!==navigationId){staged.forEach(link=>link.remove());return}
   document.dispatchEvent(new Event('isonet:before-navigate'));
   // The original header and its handlers remain mounted.
   const header=document.querySelector('.official-header');
   [...document.body.children].forEach(el=>{if(el!==header&&!el.matches('script,.official-skip'))el.remove()});
   const fragment=document.createDocumentFragment();
   for(const node of doc.body.children){if(!node.matches('script,.official-header,.official-skip'))fragment.append(document.importNode(node,true))}
   document.body.append(fragment);
   for(const attr of [...document.body.attributes])if(attr.name!=='style')document.body.removeAttribute(attr.name);
   for(const attr of doc.body.attributes)document.body.setAttribute(attr.name,attr.value);
   staged.forEach(link=>link.media='all');oldStyles.forEach(link=>link.remove());
   if(!pop){save();history.pushState({isonetScroll:{x:0,y:0}},'',url)}
   current=url.href;document.title=doc.title;
   const main=document.querySelector('main');main.id='contenido';
   header.querySelector('#official-menu')?.classList.remove('is-open');header.querySelector('.official-solutions')?.classList.remove('is-open');
   header.querySelectorAll('[aria-expanded]').forEach(button=>button.setAttribute('aria-expanded','false'));
   scrollToRoute(url,restored);markActive();
   document.dispatchEvent(new CustomEvent('isonet:navigated',{detail:{url:url.href}}));
   if(!reduced.matches&&!keyboard&&!pop)main.animate([{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'cubic-bezier(.22,1,.36,1)'});
   main.setAttribute('tabindex','-1');main.focus({preventScroll:true});
  }catch(error){if(id===navigationId){console.warn('Normal navigation fallback:',error);location.assign(url.href)}}
 }
 document.addEventListener('click',event=>{
  const a=event.target.closest('a[href]');if(!a||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;
  const url=new URL(a.href);if(!local(url))return;
  if(url.pathname===location.pathname&&url.search===location.search){return}
  event.preventDefault();save();navigate(url,{keyboard:event.detail===0});
 });
 const prefetch=event=>{const a=event.target.closest('a[href]');if(!a||a.target||navigator.connection?.saveData)return;const url=new URL(a.href);if(local(url)&&url.pathname!==location.pathname)load(url).catch(()=>{});};
 document.addEventListener('pointerover',prefetch,{passive:true});document.addEventListener('focusin',prefetch);
 addEventListener('popstate',event=>{
  const url=new URL(location.href);const previous=new URL(current);
  if(url.pathname===previous.pathname&&url.search===previous.search){current=url.href;scrollToRoute(url,event.state?.isonetScroll);markActive();return}
  navigate(url,{pop:true,restored:event.state?.isonetScroll||{x:0,y:0}});
 });
 addEventListener('hashchange',()=>{current=location.href;markActive()});markActive();
})();
