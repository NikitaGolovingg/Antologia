/* The mobile presentation shares verified catalogue data with the desktop. */
(()=>{
 const mobile=matchMedia('(max-width:560px)');
 const q=s=>document.querySelector(s), scroll=q('.m-shelf-scroll');
 let index=0, requestIndex=0, successIndex=null, mobileEngaged=false;
 const showSection=id=>{if(mobile.matches)mobileEngaged=true;cancelTransition();const section=document.getElementById(id);window.scrollTo({top:Math.ceil(section.getBoundingClientRect().top+window.scrollY),behavior:reduced()?'auto':'smooth'});};
 const updateProgress=()=>{if(!scroll.clientWidth||!scroll.scrollWidth)return;const max=scroll.scrollWidth-scroll.clientWidth,ratio=max>0?scroll.scrollLeft/max:0;const track=q('.m-progress-track');track.setAttribute('aria-valuenow',String(Math.round(ratio*100)));track.querySelector('span').style.width=`${Math.max(.15,scroll.clientWidth/scroll.scrollWidth)*100}%`;track.querySelector('span').style.left=`${ratio*(100-Math.max(.15,scroll.clientWidth/scroll.scrollWidth)*100)}%`;};
 const thumbnailLabels=[['Ростов Великий','Санкт-Петербург','Сибирь'],['Город и деревня','Древнерусские города','Историческое расселение'],['Белгородская область','Владимирская область','Воронежская область'],['Московская область','Тверская область','Ярославская область'],['Карелия','Новгородская область','Псковская область'],['Татарстан','Башкортостан','Пермский край'],['Адыгея','Ростовская область','Дагестан'],['Свердловская область','Тюменская область','Челябинская область'],['Алтай','Томская область','Красноярский край'],['Бурятия','Камчатка','Сахалин'],['Крым','Донецк','Херсонская область'],['Москва','Казань','Архитектурное наследие'],['Санкт-Петербург','Севастополь','Градостроительное развитие']];
 function updateDetails(){if(!q('.m-details'))return;const b=BOOKS[index],content=MOBILE_BOOK_CONTENT[index];q('.m-details-title').textContent=`Том ${b.tom}. ${b.title}`;q('.m-details-part').textContent=b.part?`Книга ${b.part}`:'';q('.m-details-position').textContent=`${String(index+1).padStart(2,'0')} / 13`;q('.m-details-cover').src=b.product;q('.m-details-cover').alt=`Обложка: ${label(b)}`;q('.m-details-description').textContent=content.description;
 q('.m-details-thumbnails').replaceChildren(...thumbnailLabels[index].map((t,n)=>{const f=document.createElement('figure'),img=document.createElement('img'),cap=document.createElement('figcaption'),wrap=document.createElement('div');wrap.className='m-thumb-image';img.width=300;img.height=220;img.loading='lazy';let src='assets/historical-map-1913.jpg',alt=`Картографическая иллюстрация темы «${t}», без реконструкции объектов`;if(index===0){src=['assets/mobile-thumb-rostov-v1.png','assets/mobile-thumb-petersburg-v1.png','assets/mobile-thumb-tobolsk-v1.png'][n];alt=['Художественная иллюстрация Ростовского кремля','Вид Санкт-Петербурга с Невы','Тобольский кремль — иллюстрация темы Сибири'][n];}if(index===11&&n===0){src='assets/mobile-moscow-v1.png';alt='Художественная иллюстрация Московского Кремля';}if(index===12&&n===0){src='assets/mobile-thumb-petersburg-v1.png';alt='Санкт-Петербург с Невы';}img.src=src;img.alt=alt;img.className=src.includes('historical-map')?'m-neutral-map':src.includes('hero-reference-rostov')?'m-thumb-rostov':'';cap.textContent=t;wrap.append(img);f.append(wrap,cap);return f;}));
 q('.m-details-prev').disabled=index===0;q('.m-details-next').disabled=index===12;}
 function updateRequest(){if(q('.m-request-book'))q('.m-request-book').textContent=`Выбрано: ${label(BOOKS[requestIndex])}`;}
 function openRequest(){requestIndex=index;selected=requestIndex;renderSelected();if(q('.m-success'))q('.m-success').classList.remove('m-is-open');if(q('.m-request')){q('#reader').classList.remove('m-is-open');q('#receive').classList.add('m-is-open');updateRequest();q('.m-request-result').textContent='';q('.m-news').hidden=true;}showSection('receive');if(q('.m-request h2'))q('.m-request h2').focus({preventScroll:true});}
 function openSuccess(repeat){if(!q('.m-success'))return;successIndex=requestIndex;q('#m-email').blur();q('.m-success-book').textContent=`${repeat?'Повторно выбрана':'Выбрана'} книга «${label(BOOKS[requestIndex])}».`;q('#receive').classList.remove('m-is-open');q('#reader').classList.remove('m-is-open');q('.m-success').classList.add('m-is-open');showSection('m-success');q('.m-success h2').focus({preventScroll:true});}
 function select(i,reveal=true,engage=true){
  if(engage)mobileEngaged=true;
  index=Math.max(0,Math.min(BOOKS.length-1,i));requestIndex=index;
  const b=BOOKS[index],content=MOBILE_BOOK_CONTENT[index];
  q('.m-preview-cover').src=b.product;q('.m-preview-cover').alt=`Обложка: ${label(b)}`;
  q('.m-preview-copy h3').textContent=`Том ${b.tom}. ${b.title}`;q('.m-preview-part').textContent=b.part?`Книга ${b.part}`:'';
  q('.m-preview-description').textContent=index===0?'Первая книга тома посвящена историческому городу и сохранению наследия. Рассматриваются культурный ландшафт, система расселения и развитие малых городов.':b.intro;
  q('.m-preview-position').textContent=`${String(index+1).padStart(2,'0')} / 13`;
  q('.m-preview-tags').replaceChildren(...content.tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
  const buttons=[...scroll.querySelectorAll('.m-spine')];buttons.forEach((e,n)=>e.setAttribute('aria-pressed',String(n===index)));
  q('.m-shelf-prev').disabled=index===0;q('.m-shelf-next').disabled=index===BOOKS.length-1;
  if(reveal){const el=buttons[index],left=el.offsetLeft-scroll.offsetLeft;const target=Math.max(0,left-(scroll.clientWidth-el.clientWidth)/2);scroll.scrollTo({left:target,behavior:reduced()?'auto':'smooth'});}
  updateProgress();
  updateDetails();
  updateRequest();
 }
 BOOKS.forEach((b,i)=>{const button=document.createElement('button');button.type='button';button.className='m-spine';button.setAttribute('aria-label',`Выбрать: ${label(b)}`);const cover=makeCover(b,true);cover.querySelectorAll('.cover-title-line').forEach(e=>{e.textContent=e.textContent.replace('градостроительства','градо\u00adстроительства').replace('цивилизационный','цивилиза\u00adционный').replace('Дальневосточный','Дальне\u00adвосточный');});cover.querySelectorAll('img').forEach(e=>e.draggable=false);button.append(cover);button.addEventListener('click',()=>select(i,false));scroll.append(button);});
 let drag=null,suppressClick=false;
 scroll.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){drag={x:e.clientX,left:scroll.scrollLeft,moved:false};}});
 scroll.addEventListener('pointermove',e=>{if(drag&&e.buttons===1){const delta=e.clientX-drag.x;if(Math.abs(delta)>6)drag.moved=true;if(drag.moved){scroll.scrollLeft=drag.left-delta;e.preventDefault();}}});
 window.addEventListener('pointerup',()=>{if(drag){suppressClick=drag.moved;drag=null;setTimeout(()=>suppressClick=false,0);}});
 scroll.addEventListener('click',e=>{if(suppressClick){e.stopImmediatePropagation();e.preventDefault();}},true);
 q('.m-shelf-prev').addEventListener('click',()=>select(index-1));q('.m-shelf-next').addEventListener('click',()=>select(index+1));
 scroll.addEventListener('scroll',updateProgress,{passive:true});new ResizeObserver(updateProgress).observe(scroll);
 scroll.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();select(e.key==='Home'?0:e.key==='End'?12:index+(e.key==='ArrowLeft'?-1:1));scroll.querySelectorAll('.m-spine')[index].focus({preventScroll:true});}});
 q('.m-details-button').addEventListener('click',()=>{if(q('.m-details')){if(q('.m-success'))q('.m-success').classList.remove('m-is-open');if(q('.m-request'))q('#receive').classList.remove('m-is-open');q('#reader').classList.add('m-is-open');updateDetails();}else renderBook(index);showSection('reader');if(q('.m-details-title'))q('.m-details-title').focus({preventScroll:true});});
 if(q('.m-details')){
 q('.m-details-back').addEventListener('click',()=>{showSection('books');scroll.querySelectorAll('.m-spine')[index].focus({preventScroll:true});});
 q('.m-details-prev').addEventListener('click',()=>{select(index-1);showSection('reader');q('.m-details-title').focus({preventScroll:true});});q('.m-details-next').addEventListener('click',()=>{select(index+1);showSection('reader');q('.m-details-title').focus({preventScroll:true});});
 q('.m-details-request').addEventListener('click',openRequest);}
 q('.m-request-button').addEventListener('click',openRequest);
 if(q('.m-request-form')){
 const email=q('#m-email'),error=q('.m-email-error');email.addEventListener('invalid',()=>{error.textContent='Введите адрес электронной почты в формате name@example.ru.';});email.addEventListener('input',()=>{error.textContent='';q('#email').value=email.value;});q('#email').addEventListener('input',()=>{email.value=q('#email').value;});
 q('.m-request-form').addEventListener('submit',e=>{e.preventDefault();if(!email.reportValidity())return;const address=email.value.trim().toLowerCase(),previous=demoAddresses.get(address),result=q('.m-request-result');q('.m-news').hidden=true;
 if(previous!==undefined&&previous!==requestIndex){result.textContent='В этой демонстрации для адреса уже выбрана другая книга. Повторно можно выбрать ту же книгу.';q('.m-news').hidden=false;result.focus({preventScroll:true});return;}
 demoAddresses.set(address,requestIndex);result.textContent=previous===requestIndex?'Повторный выбор этой книги допустим. Это демонстрация: письмо и PDF не отправлены.':'Выбор книги подтверждён в демонстрации. Письмо и PDF не отправлены. Адрес не сохранён на сервере.';openSuccess(previous===requestIndex);});
 q('.m-news-button').addEventListener('click',()=>{q('.m-news-result').textContent=q('.m-news input').checked?'Это демонстрация подписки. Адрес не передан, рассылка не подключена.':'Отметьте, что хотите получать новости архива.';});}
 if(q('.m-success-back'))q('.m-success-back').addEventListener('click',()=>{q('.m-success').classList.remove('m-is-open');q('#receive').classList.remove('m-is-open');q('#reader').classList.remove('m-is-open');showSection('books');scroll.querySelectorAll('.m-spine')[index].focus({preventScroll:true});});
 mobile.addEventListener('change',e=>{if(!e.matches){if(mobileEngaged&&index!==viewed)renderBook(index);}else{const committed=selected;select(viewed,false,false);requestIndex=committed;updateRequest();if(q('.m-success')&&successIndex!==committed)q('.m-success').classList.remove('m-is-open');}});
 select(0,false,false);
 window.anthologyMobile={select,get index(){return index;},get requestIndex(){return requestIndex;},showSection};
})();
