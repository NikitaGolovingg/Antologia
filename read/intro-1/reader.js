(()=>{'use strict';
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search),book=document.body.dataset.book;
let meta,available=[];
const image=$('page-image'),area=$('page-area'),layer=$('turn-layer');
let total=0,current=0,busy=false,controller,blobURL,turnTimer,requestId=0,startTouch,pendingPage=1,retiringURL;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const mobile=matchMedia('(min-width:0px)'),sheet=$('sheet');
let zoomScale=1,fitWidth=0,pinch=null,lastTap=null;
function fitMobile(){if(!mobile.matches||!image.naturalWidth)return;fitWidth=Math.min(area.clientWidth,area.clientHeight*image.naturalWidth/image.naturalHeight);sheet.style.setProperty('--mobile-sheet-width',fitWidth*zoomScale+'px')}
function zoomMobile(scale,point){
 const before=sheet.getBoundingClientRect(),box=area.getBoundingClientRect();
 point=point||{x:box.left+area.clientWidth/2,y:box.top+area.clientHeight/2};
 const fx=(point.x-before.left)/before.width,fy=(point.y-before.top)/before.height;
 zoomScale=Math.max(1,Math.min(4,scale));document.body.classList.toggle('zoomed',zoomScale>1.01);fitMobile();
 $('zoom').setAttribute('aria-pressed',String(zoomScale>1.01));$('zoom').setAttribute('aria-label',zoomScale>1.01?'Уместить страницу':'Увеличить страницу');$('zoom').innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m15 15 7 7" stroke="currentColor" stroke-width="1.7"/></svg>';
 if(zoomScale>1.01){area.scrollLeft=fx*sheet.clientWidth-(point.x-box.left);area.scrollTop=fy*sheet.clientHeight-(point.y-box.top)}else{area.scrollLeft=0;area.scrollTop=0}
}
const scheduleFit=()=>requestAnimationFrame(fitMobile);window.addEventListener('resize',scheduleFit);window.visualViewport?.addEventListener('resize',scheduleFit);document.addEventListener('reader-page',scheduleFit);image.addEventListener('load',scheduleFit);document.fonts?.ready.then(scheduleFit);
mobile.addEventListener('change',()=>{zoomScale=1;document.body.classList.remove('zoomed');$('zoom').innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m15 15 7 7" stroke="currentColor" stroke-width="1.7"/></svg>';$('zoom').setAttribute('aria-pressed','false');$('zoom').setAttribute('aria-label','Увеличить страницу');fitMobile()});
// Keep only the current page and its immediate neighbours decoded.
const readyPages=new Map(),pendingPages=new Map();let loadingTimer;
async function preparePage(n){
 if(readyPages.has(n))return readyPages.get(n);
 if(pendingPages.has(n))return pendingPages.get(n);
 const task=(async()=>{let url;try{
  const res=await fetch(meta.images[String(n)],{cache:'force-cache'});if(!res.ok)throw Error('render');
  url=URL.createObjectURL(await res.blob());const decoded=new Image();decoded.src=url;await decoded.decode();
  const result={url,decoded};readyPages.set(n,result);return result;
 }catch(e){if(url)URL.revokeObjectURL(url);throw e}finally{pendingPages.delete(n)}})();
 pendingPages.set(n,task);return task;
}
function trimPages(){const i=available.indexOf(current),keep=new Set(available.slice(Math.max(0,i-1),i+2));keep.add(pendingPage);for(const [n,item] of readyPages){if(!keep.has(n)){URL.revokeObjectURL(item.url);readyPages.delete(n)}}}
function warmNeighbours(){const i=available.indexOf(current);for(const n of [available[i-1],available[i+1]])if(n!==undefined)preparePage(n).then(trimPages).catch(()=>{});trimPages()}
function controls(){ $('previous').disabled=busy||available.indexOf(current)<=0;$('next').disabled=busy||!total||available.indexOf(current)>=available.length-1;area.setAttribute('aria-busy',String(busy));if(!busy){clearTimeout(loadingTimer);$('loading').hidden=true;}}
async function showPage(n,animate=false){
 animate=false;
 if(!total||!Number.isFinite(Number(n)))return;n=Math.max(1,Math.min(total,Math.trunc(Number(n))||1));
 if(!available.includes(n)){window.showUnavailable(n);return}
 if(n===current&&!$('error').hidden){animate=false}else if(n===current)return;
 const id=++requestId;pendingPage=n;busy=true;clearTimeout(loadingTimer);$('loading').hidden=true;loadingTimer=setTimeout(()=>{if(busy)$('loading').hidden=false},250);controls();$('error').hidden=true;
 try{
  const {url}=await preparePage(n);if(id!==requestId)return;
  layer.replaceChildren();layer.className='';
  blobURL=url;image.src=url;image.alt='Страница '+n;current=n;$('page-number').value=n;$('page-status').textContent='Страница '+n+' из '+total;
  if(mobile.matches){area.scrollLeft=0;area.scrollTop=0}
  history.replaceState(null,'','?'+new URLSearchParams({page:n})); document.dispatchEvent(new CustomEvent('reader-page',{detail:{page:n}}));
 }catch(e){if(e.name!=='AbortError'&&id===requestId){$('error').hidden=false;$('page-number').value=current||1}}
 finally{if(id===requestId){busy=false;controls();warmNeighbours()}}
}
for(const [id,step] of [['previous',-1],['next',1]])$(id).addEventListener('click',e=>{if(e.detail>0)e.currentTarget.blur();showPage(available[available.indexOf(current)+step])});
$('page-form').addEventListener('submit',e=>{e.preventDefault();showPage($('page-number').value)});
$('retry').addEventListener('click',()=>showPage(pendingPage,false));
$('zoom').addEventListener('click',()=>{if(mobile.matches){zoomMobile(zoomScale>1.01?1:2.5);return}const active=document.body.classList.toggle('zoomed');$('zoom').setAttribute('aria-pressed',String(active));$('zoom').setAttribute('aria-label',active?'Уместить страницу':'Увеличить страницу');$('zoom').innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m15 15 7 7" stroke="currentColor" stroke-width="1.7"/></svg>'});
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|BUTTON/.test(e.target.tagName)||busy||document.querySelector('dialog[open]'))return;if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();showPage(e.key==='Home'?available[0]:e.key==='End'?available.at(-1):available[available.indexOf(current)+(e.key==='ArrowRight'?1:-1)])}});
area.addEventListener('touchstart',e=>{
 if(e.touches.length===2&&mobile.matches){startTouch=null;lastTap=null;pinch={distance:Math.hypot(e.touches[1].clientX-e.touches[0].clientX,e.touches[1].clientY-e.touches[0].clientY),scale:zoomScale};return}
 pinch=null;startTouch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY,left:area.scrollLeft,top:area.scrollTop}:null;
},{passive:true});
area.addEventListener('touchmove',e=>{
 if(!mobile.matches)return;
 if(pinch&&e.touches.length===2){e.preventDefault();const [a,b]=e.touches;zoomMobile(pinch.scale*Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY)/Math.max(1,pinch.distance),{x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});return}
 if(startTouch&&zoomScale>1.01&&e.touches.length===1){e.preventDefault();area.scrollLeft=startTouch.left-(e.touches[0].clientX-startTouch.x);area.scrollTop=startTouch.top-(e.touches[0].clientY-startTouch.y)}
},{passive:false});
area.addEventListener('touchend',e=>{
 if(pinch){pinch=null;startTouch=null;return}if(!startTouch||busy)return;
 const t=e.changedTouches[0],dx=t.clientX-startTouch.x,dy=t.clientY-startTouch.y;startTouch=null;
 if(mobile.matches&&Math.abs(dx)<15&&Math.abs(dy)<15){const now=performance.now();if(lastTap&&now-lastTap.time<320&&Math.hypot(t.clientX-lastTap.x,t.clientY-lastTap.y)<35){zoomMobile(zoomScale>1.01?1:2.5,{x:t.clientX,y:t.clientY});lastTap=null;return}lastTap={time:now,x:t.clientX,y:t.clientY}}
 if(document.body.classList.contains('zoomed'))return;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)showPage(available[available.indexOf(current)+(dx<0?1:-1)]);
},{passive:true});
area.addEventListener('touchcancel',()=>{startTouch=null;pinch=null;lastTap=null},{passive:true});
window.Reader={go:showPage,page:()=>current,zoom:()=>zoomScale};
window.ReaderReady=fetch('./book.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{
meta=data;available=meta.availablePages;total=meta.lastPage;document.title=meta.title+' — Антология';$('book-title').textContent=meta.title;$('page-total').textContent='/ '+total;$('page-number').max=total;
let saved;try{saved=JSON.parse(localStorage.getItem('anthology-demo-'+book))?.page}catch{}
const n=Number(params.get('page')||saved||available[0]);showPage(available.includes(n)?n:available[0],false);if(params.has('page')&&!available.includes(n))setTimeout(()=>window.showUnavailable(n),0);return meta;
}).catch(()=>{$('book-title').textContent='Книга недоступна';$('error').hidden=false;busy=false;controls()});
})();
