(() => {
  'use strict';
  const categories = [
    {id:'robux',name:'Robux',game:'Roblox',match:'robux'},
    {id:'v-bucks',name:'V-Bucks',game:'Fortnite',match:'v-bucks'},
    {id:'diamantes',name:'Diamantes',game:'Free Fire',match:'diamantes'},
    {id:'valorant-points',name:'Valorant Points',game:'Valorant',match:'-vp.html'}
  ];
  const nav = document.querySelector('header .nav');
  nav?.querySelector('.logo-mark')?.closest('a')?.remove();
  if(nav && !nav.querySelector('.brand')) nav.insertAdjacentHTML('afterbegin','<a class="gx-brand" href="gamex-brasil.html" aria-label="GameX Brasil, início">GAME<b>X</b></a>');
  const brand = nav?.querySelector('.gx-brand, .brand');
  if(brand){brand.classList.add('gx-gif-brand');brand.innerHTML='<img src="assets/gamex-logo.gif" width="64" height="64" alt="GameX Brasil">';}
  document.querySelectorAll('.hero-art img, footer img[alt*="GameX"]').forEach(img=>{img.src='assets/gamex-x.svg';img.alt='X — GameX Brasil';});
  document.querySelectorAll('.video-frame').forEach(frame=>{
    frame.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/HNIRNPcdG8M" title="Vídeo de orientação GameX" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    const link=document.createElement('a');link.href='https://www.youtube.com/watch?v=HNIRNPcdG8M';link.target='_blank';link.rel='noopener noreferrer';link.className='gx-video-link';link.textContent='Assistir no YouTube ↗';const wrap=document.createElement('div');wrap.className='gx-video-wrap';frame.before(wrap);wrap.append(frame,link);
  });
  let burger = document.querySelector('.burger');
  if(!burger && nav?.querySelector('.nav-links')) {
    nav.insertAdjacentHTML('beforeend','<button class="burger" type="button" aria-label="Abrir categorias" aria-expanded="false"><span></span><span></span><span></span></button>');
    burger = nav.querySelector('.burger');
  }
  function closeMenu(){document.querySelector('.nav-links')?.classList.remove('gx-open');burger?.setAttribute('aria-expanded','false');}
  burger?.addEventListener('click',()=>{const open=burger.getAttribute('aria-expanded')!=='true';document.querySelector('.nav-links')?.classList.toggle('gx-open',open);burger.setAttribute('aria-expanded',String(open));burger.setAttribute('aria-label',open?'Fechar categorias':'Abrir categorias');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.addEventListener('click',e=>{if(nav&&!nav.contains(e.target))closeMenu();});
  document.querySelectorAll('a[href*="#produtos"]').forEach(link=>{
    const text=link.textContent.trim().toLowerCase();
    const cat=categories.find(c=>text===c.name.toLowerCase()||link.dataset.menuFilter===c.id);
    if(cat){link.href='gamex-brasil.html?categoria='+cat.id+'#produtos';link.dataset.menuFilter=cat.id;}
  });
  document.querySelectorAll('.faq-q').forEach((q,i)=>{
    const answer=q.nextElementSibling;if(!answer)return;
    answer.id='faq-answer-'+i;q.setAttribute('role','button');q.tabIndex=0;q.setAttribute('aria-controls',answer.id);q.setAttribute('aria-expanded','false');
    q.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();q.click();}});
    q.addEventListener('click',()=>document.querySelectorAll('.faq-q').forEach(other=>other.setAttribute('aria-expanded',String(other.parentElement.classList.contains('open')))));
  });
  const grid=document.querySelector('#produtos .products');
  if(grid){
    const cards=Array.from(grid.querySelectorAll('.card'));
    const pills=Array.from(document.querySelectorAll('.cat-pill'));
    const host=document.createElement('div');host.className='catalog-groups';host.id='catalog-results';
    grid.replaceWith(host);
    const groups=categories.map((cat,index)=>{
      const items=cards.filter(card=>(card.getAttribute('href')||'').includes(cat.match));
      const section=document.createElement('section');section.className='category-group gx-entry';section.setAttribute('aria-labelledby','category-'+cat.id);
      section.innerHTML='<div class="category-heading"><span class="category-index">0'+(index+1)+'</span><div><h3 id="category-'+cat.id+'">'+cat.name+'</h3><p>'+cat.game+' · escolha seu pacote</p></div><span class="category-count"></span></div><div class="products"></div>';
      items.forEach(card=>{card.querySelector('img')?.setAttribute('loading','lazy');card.insertAdjacentHTML('beforeend','<div class="card-action">Ver pacote <span aria-hidden="true">↗</span></div>');section.querySelector('.products').append(card);});
      host.append(section);return {cat,items,section};
    });
    const tools=document.createElement('div');tools.className='catalog-tools';tools.innerHTML='<label for="catalog-search">Buscar um pacote<input type="search" id="catalog-search" placeholder="Ex.: 1200 Robux ou Fortnite" autocomplete="off"></label><label for="catalog-sort">Ordenar por<select id="catalog-sort"><option value="default">Destaques</option><option value="price-up">Menor preço</option><option value="price-down">Maior preço</option></select></label>';
    host.before(tools);
    const status=document.createElement('p');status.className='catalog-status';status.setAttribute('role','status');tools.after(status);
    const empty=document.createElement('div');empty.className='catalog-empty';empty.hidden=true;empty.innerHTML='<h3>Nenhum pacote encontrado</h3><p>Tente outro nome ou escolha uma categoria diferente.</p><button type="button">Limpar filtros</button>';host.after(empty);
    let active=new URLSearchParams(location.search).get('categoria')||'all';if(!categories.some(c=>c.id===active))active='all';
    const search=tools.querySelector('input'),sort=tools.querySelector('select');
    const normalize=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const price=card=>Number(card.querySelector('.now').textContent.replace(/[^\d,]/g,'').replace(',','.'));
    function update(){
      let total=0;
      groups.forEach(({cat,items,section})=>{
        let count=0;const ordered=items.slice();if(sort.value!=='default')ordered.sort((a,b)=>(price(a)-price(b))*(sort.value==='price-up'?1:-1));
        ordered.forEach(card=>{
          card.hidden=(active!=='all'&&active!==cat.id)||!normalize(card.querySelector('h3').textContent+' '+cat.game).includes(normalize(search.value.trim()));
          if(!card.hidden)count++;section.querySelector('.products').append(card);
        });
        section.hidden=!count;section.querySelector('.category-count').textContent=count+' pacote'+(count===1?'':'s');total+=count;
      });
      pills.forEach(pill=>{const chosen=pill.dataset.filter===active;pill.classList.toggle('active',chosen);pill.setAttribute('aria-pressed',String(chosen));pill.setAttribute('aria-controls',host.id);});
      status.textContent=total+' pacote'+(total===1?'':'s')+' encontrado'+(total===1?'':'s')+(active==='all'?' · organizados por jogo':'');empty.hidden=!!total;
    }
    function select(value){active=value;update();const url=new URL(location.href);if(active==='all')url.searchParams.delete('categoria');else url.searchParams.set('categoria',active);history.replaceState(null,'',url);}
    pills.forEach(pill=>pill.addEventListener('click',()=>select(pill.dataset.filter)));
    search.addEventListener('input',update);sort.addEventListener('change',update);
    document.querySelectorAll('[data-menu-filter]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();select(link.dataset.menuFilter);closeMenu();document.getElementById('produtos').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
    empty.querySelector('button').addEventListener('click',()=>{search.value='';sort.value='default';select('all');search.focus();});
    update();
  }
  const hero=document.querySelector('.hero-art');if(hero)hero.insertAdjacentHTML('beforeend','<span class="gx-hero-label">ESCOLHA. RECARREGUE. JOGUE.</span>');
  if(document.querySelector('.product-hero')){
    const sections=Array.from(document.querySelectorAll('section.section'));
    const links=[];sections.forEach((section,i)=>{section.id='produto-info-'+i;const title=section.querySelector('h2');if(title)links.push('<a href="#'+section.id+'">'+title.textContent+'</a>');});
    document.querySelector('.product-hero').insertAdjacentHTML('afterend','<nav class="wrap gx-section-nav" aria-label="Informações do produto">'+links.join('')+'</nav>');
    document.querySelector('#qty-minus')?.setAttribute('aria-label','Diminuir quantidade');document.querySelector('#qty-plus')?.setAttribute('aria-label','Aumentar quantidade');document.querySelector('#qty-input')?.setAttribute('aria-label','Quantidade');
    const category=document.querySelector('#bc-cat');const cat=categories.find(c=>c.name.toLowerCase()===category?.textContent.toLowerCase());if(cat)category.href='gamex-brasil.html?categoria='+cat.id+'#produtos';
  }
})();

