'use strict';
const BOOKS = [
 {tom:1,part:1,title:'Наследие — цивилизационный код',intro:'Вводная книга собрания: историческое наследие, культурная память и вопросы сохранения поселений.'},
 {tom:1,part:2,title:'У истоков российского градостроительства',intro:'Вводная книга о становлении российского градостроительства и исторических основах развития поселений.'},
 {tom:2,part:1,title:'Центральный федеральный округ',intro:'Исторические города и сёла Центральной России — архитектура, культурная память и градостроительная история. Исследования раскрывают планировку поселений и развитие территорий.',subjects:18,settlements:1347,shared:true},
 {tom:2,part:2,title:'Центральный федеральный округ',intro:'Продолжение исследования исторических городов и сёл Центральной России. Архитектурное наследие и планировочная структура поселений рассматриваются в истории развития территорий.',subjects:18,settlements:1347,shared:true},
 {tom:3,title:'Северо-Западный федеральный округ',intro:'Исторические города и сёла Северо-Западной России. Исследования поселений соединяют историю архитектуры, планировочной структуры и культурного наследия.',subjects:11,settlements:416},
 {tom:4,title:'Приволжский федеральный округ',intro:'Исторические поселения Приволжья: архитектура, культурное наследие и градостроительная история территорий.',subjects:14,settlements:1226},
 {tom:5,title:'Южный и Северо-Кавказский федеральные округа',intro:'Исторические города и сёла юга России и Северного Кавказа. Архитектура и планировка поселений в истории развития территорий.',subjects:13,settlements:737},
 {tom:6,title:'Уральский федеральный округ',intro:'Исторические поселения Урала: архитектурное наследие, планировочная структура и история развития территорий.',subjects:6,settlements:206},
 {tom:7,title:'Сибирский федеральный округ',intro:'Исторические города и сёла Сибири. Исследования архитектуры и градостроительства раскрывают историю освоения и развития территорий.',subjects:10,settlements:823},
 {tom:8,title:'Дальневосточный федеральный округ',intro:'Исторические поселения Дальнего Востока — архитектура, градостроительная история и культурная память территорий.',subjects:11,settlements:510},
 {tom:9,title:'Крым и Новороссия',intro:'Исторические города и сёла Крыма и Новороссии: архитектурное наследие, планировка и история поселений.',subjects:6,settlements:995},
 {tom:10,part:1,title:'Москва. Казань',intro:'Москва и Казань — два города-маяка собрания. История архитектуры, городского пространства и культурного наследия.'},
 {tom:10,part:2,title:'Санкт-Петербург. Севастополь',intro:'Санкт-Петербург и Севастополь — два города-маяка собрания. Архитектурное наследие и градостроительная история.'}
].map((b,i)=>({...b,id:i,cover:`assets/cover-${String(i+1).padStart(2,'0')}.png`,product:`assets/book-product-${String(i+1).padStart(2,'0')}.png`}));
let viewed=2,selected=2;
const $=s=>document.querySelector(s);
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function go(id){document.getElementById(id).scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});}
function label(book){return `Том ${book.tom}${book.part?`, книга ${book.part}`:''}. ${book.title}`;}
function makeCover(book,compact=false){
 if(!document.getElementById('shelf-gold-crest')){
  const svgNS='http://www.w3.org/2000/svg';
  const filter=document.createElementNS(svgNS,'filter');filter.id='shelf-gold-crest';filter.setAttribute('color-interpolation-filters','sRGB');
  const luminance=document.createElementNS(svgNS,'feColorMatrix');luminance.setAttribute('type','matrix');luminance.setAttribute('values','0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .85 2.86 .29 0 -.8');luminance.setAttribute('result','crest-mask');
  const gold=document.createElementNS(svgNS,'feFlood');gold.setAttribute('flood-color','#d9b161');gold.setAttribute('result','crest-gold');
  const composite=document.createElementNS(svgNS,'feComposite');composite.setAttribute('in','crest-gold');composite.setAttribute('in2','crest-mask');composite.setAttribute('operator','in');
  filter.append(luminance,gold,composite);document.querySelector('.symbols').append(filter);
 }
 const node=document.createElement('div');node.className='edition-cover';
 const crest=document.createElement('span');crest.className='cover-crest';const image=document.createElement('img');image.src='assets/cover-03.png';image.alt='';crest.append(image);
 const number=document.createElement('span');number.className='cover-number';number.textContent=`Том ${book.tom}`;
 const name=document.createElement('span');name.className='cover-name';
 const shelfLines=[['Наследие —','цивилизационный','код'],['У истоков','российского','градостроительства'],['Центральный','федеральный','округ'],['Центральный','федеральный','округ'],['Северо-Западный','федеральный','округ'],['Приволжский','федеральный','округ'],['Южный','и Северо-','Кавказский','округа'],['Уральский','федеральный','округ'],['Сибирский','федеральный','округ'],['Дальневосточный','федеральный','округ'],['Крым и','Новороссия'],['Москва. Казань'],['Санкт-Петербург.','Севастополь']];
 if(compact){for(const text of shelfLines[book.id]){const line=document.createElement('span');line.className='cover-title-line';line.textContent=text;name.append(line);}}else name.textContent=book.title;
 const part=document.createElement('span');part.className='cover-part';part.textContent=book.part?`Книга ${book.part}`:'';
 const city=document.createElement('span');city.className='cover-city';city.setAttribute('aria-hidden','true');
 node.append(crest,number,part,name,city);return node;
}
function renderBook(index,animate=false){
 viewed=(index+BOOKS.length)%BOOKS.length;const b=BOOKS[viewed];
 $('.reader-title').textContent=`Том ${b.tom}. ${b.title}`;
 $('.reader-volume').textContent=b.part?`Книга ${b.part}`:'';
 $('.reader-intro').textContent=b.intro;
 $('.reader-cover').src=b.cover;$('.reader-cover').alt=`Обложка: ${label(b)}`;const fullCover=document.createElement('img');fullCover.src=b.product;fullCover.alt=`Обложка: ${label(b)}`;fullCover.addEventListener('load',()=>{if($('.reader-display-cover').contains(fullCover))$('.standing-book').style.setProperty('--cover-ratio',`${fullCover.naturalWidth}/${fullCover.naturalHeight}`);});$('.reader-display-cover').replaceChildren(fullCover);
 $('.reader-position').textContent=`${viewed+1} / 13`;
 $('.choose-book').textContent=`Получить Том ${b.tom}`;
 document.querySelectorAll('.horizontal-spine').forEach(el=>el.textContent=`Том ${b.tom}`);
 const geo=$('.reader-geography');geo.replaceChildren();
 if(b.subjects){geo.append(document.createTextNode(`${b.subjects} субъектов · ${b.settlements.toLocaleString('ru-RU')} населённых пунктов`));const note=document.createElement('span');note.textContent=b.shared?'Данные для двух книг тома вместе. Предварительный подсчёт, 2025 год.':'Предварительный подсчёт, 2025 год.';geo.append(note);}
 document.querySelectorAll('.cover-button').forEach((el,i)=>el.setAttribute('aria-pressed',String(i===viewed)));
 if(animate&&!reduced())$('.standing-book').animate([{transform:'translate(-50%,-50%) translateY(40px) rotateY(-55deg)',opacity:.35},{transform:'translate(-50%,-50%)',opacity:1}],{duration:500,easing:'cubic-bezier(.2,.7,.2,1)'});
}
function renderSelected(){const b=BOOKS[selected];$('.capture-title').textContent=`Том ${b.tom}. ${b.title}`;$('.capture-volume').textContent=b.part?`Книга ${b.part}`:'';$('.result').textContent='';$('.subscription').hidden=true;}
let transitionSerial=0;
let activeFlight=null;
function cancelTransition(){
 transitionSerial++;
 if(activeFlight){activeFlight.remove();activeFlight=null;}
 document.querySelectorAll('.standing-book,.reader-copy').forEach(el=>{el.getAnimations().forEach(a=>a.cancel());el.style.visibility='';});
 return transitionSerial;
}
function scrollDestination(element){return Math.max(0,Math.min(element.getBoundingClientRect().top+window.scrollY,document.documentElement.scrollHeight-window.innerHeight));}
function focusQuietly(element){element.focus({preventScroll:true});}
function flight(source,target,scrollElement,returning=false){
 const serial=cancelTransition();
 if(reduced()){go(scrollElement.id);if(returning)focusQuietly(target);return;}
 const sourceRect=source.getBoundingClientRect();
 const startScroll=window.scrollY,endScroll=scrollDestination(scrollElement);
 const targetRect=target.getBoundingClientRect();
 const endX=targetRect.left,endY=targetRect.top+startScroll-endScroll;
 const image=source.matches('img,.edition-cover')?source:(source.querySelector('.edition-cover')||source.querySelector('img'));
 const overlay=document.createElement('div');
 Object.assign(overlay.style,{position:'fixed',left:'0',top:'0',width:sourceRect.width+'px',height:sourceRect.height+'px',zIndex:'1000',pointerEvents:'none',transformOrigin:'center',transformStyle:'preserve-3d',perspective:'900px'});
 const pages=document.createElement('div');
 Object.assign(pages.style,{position:'absolute',inset:'0',background:'repeating-linear-gradient(90deg,#f9edd0 0 2px,#decaa3 2px 3px)',border:'1px solid #b99b65',transformOrigin:'left',boxShadow:'8px 14px 25px #42231640'});
 const cover=image.cloneNode(true);
 Object.assign(cover.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'fill',transformOrigin:'left',backfaceVisibility:'hidden',boxShadow:'6px 8px 20px #42231655'});
 overlay.append(pages,cover);document.body.append(overlay);activeFlight=overlay;
 const standing=$('.standing-book');standing.style.visibility='hidden';
 const startTime=performance.now();
 function tick(now){
  if(serial!==transitionSerial){overlay.remove();return;}
  const t=Math.min(1,(now-startTime)/500);const e=1-Math.pow(1-t,3);
  window.scrollTo({top:startScroll+(endScroll-startScroll)*e,behavior:'instant'});
  const scaleX=1+(targetRect.width/sourceRect.width-1)*e,scaleY=1+(targetRect.height/sourceRect.height-1)*e;
  const angle=(returning?1:-1)*Math.sin(t*Math.PI)*44;
  overlay.style.transform=`translate(${sourceRect.left+(endX-sourceRect.left)*e}px,${sourceRect.top+(endY-sourceRect.top)*e}px) scale(${scaleX},${scaleY}) rotateZ(${Math.sin(t*Math.PI)*(returning?4:-4)}deg)`;
  cover.style.transform=`perspective(900px) rotateY(${angle}deg)`;
  pages.style.transform=`rotateY(${angle*.18}deg)`;
  if(t<1)requestAnimationFrame(tick);else{overlay.remove();activeFlight=null;standing.style.visibility='';if(returning)focusQuietly(target);else{const heading=$('.reader-title');heading.tabIndex=-1;focusQuietly(heading);}}
 }
 requestAnimationFrame(tick);
}
function openFromShelf(index,button){cancelTransition();renderBook(index);flight(button,$('.reader-display-cover'),$('#reader'));}
function returnToShelf(){const button=document.querySelectorAll('.cover-button')[viewed];flight($('.reader-display-cover'),button,$('#books'),true);}
async function changeBook(direction){
 const serial=cancelTransition();
 if(reduced()){renderBook(viewed+direction);return;}
 const standing=$('.standing-book'),copy=$('.reader-copy');
 const out=standing.animate([{transform:'translate(-50%,-50%)',opacity:1},{transform:`translate(-50%,-50%) translateX(${-direction*30}px) rotateY(${direction*65}deg)`,opacity:0}],{duration:200,easing:'ease-in',fill:'forwards'});
 copy.animate([{opacity:1},{opacity:.3}],{duration:200,fill:'forwards'});
 try{await out.finished;}catch{return;}
 if(serial!==transitionSerial)return;
 standing.getAnimations().forEach(a=>a.cancel());copy.getAnimations().forEach(a=>a.cancel());
 renderBook(viewed+direction);
 standing.animate([{transform:`translate(-50%,-50%) translateX(${direction*32}px) rotateY(${-direction*65}deg)`,opacity:0},{transform:'translate(-50%,-50%)',opacity:1}],{duration:300,easing:'cubic-bezier(.2,.7,.2,1)'});
 copy.animate([{opacity:.3},{opacity:1}],{duration:300,easing:'ease-out'});
}
BOOKS.forEach((book,index)=>{const button=document.createElement('button');button.type='button';button.className='cover-button';button.setAttribute('aria-label',`Открыть: ${label(book)}`);button.setAttribute('aria-pressed','false');button.append(makeCover(book,true));button.addEventListener('click',()=>openFromShelf(index,button));$(index<6?'.cover-row-six':'.cover-row-seven').append(button);});
$('.hero-cta').addEventListener('click',()=>{cancelTransition();go('books');});
$('.reader-back').addEventListener('click',returnToShelf);
$('.reader-prev').addEventListener('click',()=>changeBook(-1));
$('.reader-next').addEventListener('click',()=>changeBook(1));
$('.choose-book').addEventListener('click',()=>{cancelTransition();selected=viewed;renderSelected();go('receive');});
const demoAddresses=new Map();
$('.form-panel form').addEventListener('submit',event=>{event.preventDefault();const input=$('#email');if(!input.reportValidity())return;const address=input.value.trim().toLowerCase();const previous=demoAddresses.get(address);const result=$('.result');$('.subscription').hidden=true;
 if(previous!==undefined&&previous!==selected){result.textContent='Для этого адреса уже выбрана другая книга. Цифровое распространение ограничено одной книгой на email. Вы можете подписаться на новости будущего цифрового архива.';$('.subscription').hidden=false;return;}
 demoAddresses.set(address,selected);result.textContent=previous===selected?'В демонстрации повторный выбор этой книги разрешён. Письмо не отправлено: отправка ещё не подключена.':'В демонстрации этот адрес закреплён за выбранной книгой. Письмо не отправлено: отправка ещё не подключена.';
});
$('.subscribe-button').addEventListener('click',()=>{$('.subscription-result').textContent=$('.subscription-consent input').checked?'Выбран сценарий подписки. В этом предпросмотре адрес не передаётся, рассылка ещё не подключена.':'Отметьте согласие на получение новостей архива.';});
renderBook(viewed);renderSelected();



