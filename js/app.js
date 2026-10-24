/* ===== 公考备考笔记 · 共享脚本 =====
 * 依赖：js/nav.js（NAV_DATA 导航数据源，需先于本文件引入）
 * 页面约定：每个页面在 <head> 里定义
 *   window.SITE_ROOT = ''（首页）或 '../../'（二级子页）
 *   window.PAGE_PATH = 本页相对根目录路径（如 'pages/finance/finance.html'）
 *
 * 本地存储约定：
 *   cardContent.v2:{页面路径}:{卡片id}  → 逐卡编辑内容
 *   mastery.v2:{页面路径}               → 掌握度 {"卡片id":"blur"|"ok"}
 *   mastery.v2:concepts-overview        → 概念总览页概念级掌握度 {"概念详情页路径":"blur"|"ok"}
 *   review.v2                           → 复习排期 {"页面#卡片id":{due,title,page,hash}}
 *   nav.open.v2                         → 侧边栏分组展开记忆
 *   theme                               → 深色模式 'dark'|'light'
 */

// ---------- 标题字体：霞鹜文楷屏幕版（CDN 加载失败自动回退系统字体） ----------
(function(){
  const l=document.createElement('link');
  l.rel='stylesheet';
  l.href='https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont/style.css';
  document.head.appendChild(l);
})();

// ---------- 通用工具 ----------
function pagePath(){ return window.PAGE_PATH || 'notes.html'; }
function siteRoot(){ return window.SITE_ROOT || ''; }
function readJSON(key,def){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):def; }catch(e){ return def; } }
function writeJSON(key,val){ try{ localStorage.setItem(key,JSON.stringify(val)); }catch(e){} }
function todayStr(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function addDaysStr(n){ const d=new Date(); d.setDate(d.getDate()+n); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function daysBetween(a,b){ return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/86400000); }
function escAttr(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function cardTitle(card){ const h=card&&card.querySelector('h3'); return h?h.textContent.trim():''; }

// ---------- 内联图标 ----------
const I = {
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  pencil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  landmark:'<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  trend:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  coins:'<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  branch:'<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  alert:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
};
function iconSvg(name){
  const p=I[name];
  return p?`<svg class="gt-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`:'';
}

// ---------- 轻提示 ----------
let toastTimer=null;
function toast(msg){
  let t=document.getElementById('appToast');
  if(!t){ t=document.createElement('div'); t.id='appToast'; document.body.appendChild(t); }
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),1800);
}

// ---------- 掌握度（未学/模糊/已掌握） ----------
const MASTERY_ORDER=['','blur','ok'];
function masteryAll(){
  const map={};
  try{
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(k && k.indexOf('mastery.v2:')===0){
        const page=k.slice(11);
        const data=readJSON(k,{});
        Object.keys(data).forEach(id=>{ if(data[id]) map[page+'#'+id]=data[id]; });
      }
    }
  }catch(e){}
  return map;
}
function masteryOf(page,id){ return masteryAll()[page+'#'+id]||''; }
function cycleMastery(id){
  const card=document.getElementById(id); if(!card) return;
  const data=readJSON('mastery.v2:'+pagePath(),{});
  const next=MASTERY_ORDER[(MASTERY_ORDER.indexOf(data[id]||'')+1)%3];
  if(next) data[id]=next; else delete data[id];
  writeJSON('mastery.v2:'+pagePath(),data);
  const st=card.querySelector('.ct-master .m-dot');
  if(st) st.className='m-dot'+(next?' s-'+next:'');
  updateSidebarDots(id,next);
  renderHomePanel();
}
function updateSidebarDots(id,state){
  const key=pagePath()+'#'+id;
  document.querySelectorAll('#sidebarNav .sec-link[data-mkey]').forEach(a=>{
    if(a.dataset.mkey===key){
      const d=a.querySelector('.m-dot');
      if(d) d.className='m-dot'+(state?' s-'+state:'');
    }
  });
}

// ---------- 复习排期 ----------
function reviewGet(page,id){ return readJSON('review.v2',{})[page+'#'+id]; }
function setReview(id,n){
  const page=pagePath(), card=document.getElementById(id);
  const all=readJSON('review.v2',{});
  all[page+'#'+id]={due:addDaysStr(n),title:cardTitle(card)||id,page:page,hash:id};
  writeJSON('review.v2',all);
  closeReviewPop(); updateCardTools(card); renderHomePanel();
  toast(n+' 天后提醒复习');
}
function clearReview(id){
  const all=readJSON('review.v2',{});
  delete all[pagePath()+'#'+id];
  writeJSON('review.v2',all);
  closeReviewPop(); updateCardTools(document.getElementById(id)); renderHomePanel();
  toast('已清除复习排期');
}
let reviewPop=null;
function closeReviewPop(){ if(reviewPop){ reviewPop.remove(); reviewPop=null; } }
function openReviewPop(id,btn){
  closeReviewPop();
  const item=reviewGet(pagePath(),id);
  const today=todayStr();
  const pop=document.createElement('div'); pop.className='review-pop';
  pop.innerHTML=`<div class="rp-h">安排复习</div>`
    +(item?`<div class="rp-cur">下次：${item.due}${item.due<today?'（已到期）':''}</div>`:`<div class="rp-cur">未排期</div>`)
    +`<div class="rp-row">`
    +[3,7,14,30].map(n=>`<button onclick="setReview('${id}',${n})">${n}天</button>`).join('')
    +`<button class="rp-clear" onclick="clearReview('${id}')">清除</button></div>`;
  document.body.appendChild(pop);
  const r=btn.getBoundingClientRect();
  let left=Math.max(8,Math.min(r.left,window.innerWidth-pop.offsetWidth-12));
  let top=r.bottom+8;
  if(top+pop.offsetHeight>window.innerHeight-8) top=Math.max(8,r.top-pop.offsetHeight-8);
  pop.style.left=left+'px'; pop.style.top=top+'px';
  reviewPop=pop;
  setTimeout(()=>{
    document.addEventListener('click',function close(e){
      if(!pop.contains(e.target)&&e.target!==btn&&!btn.contains(e.target)){ closeReviewPop(); document.removeEventListener('click',close); }
    });
  },0);
}

// ---------- 逐卡编辑 ----------
let isEditing=false, openEditCard=null;
function editKey(){ return 'notesContent.v2:'+pagePath(); }
function cardKeyOf(id){ return 'cardContent.v2:'+pagePath()+':'+id; }
function pageHasCards(){ return document.querySelectorAll('details.card[id]').length>0; }
function toggleEdit(){
  if(pageHasCards()) toggleCardEdit(); else toggleLegacyEdit();
}
function toggleCardEdit(){
  isEditing=!isEditing;
  document.body.classList.toggle('editing',isEditing);
  const btn=document.getElementById('editBtn');
  if(btn){
    btn.textContent=isEditing?'保存':'编辑';
    btn.style.background=isEditing?'var(--brand-1)':'var(--bg)';
    btn.style.color=isEditing?'#fff':'';
  }
  if(!isEditing&&openEditCard) finishCardEdit(openEditCard);
  toast(isEditing?'编辑模式：点卡片右上角铅笔修改单卡':'编辑模式已关闭');
}
function startCardEdit(id){
  const card=document.getElementById(id); if(!card) return;
  if(openEditCard&&openEditCard!==card) finishCardEdit(openEditCard);
  openEditCard=card;
  try{ card.contentEditable='true'; }catch(e){}
  card.classList.add('card-editing');
  const b=card.querySelector('.ct-edit');
  if(b){ b.innerHTML=I.check; b.title='保存本卡'; b.onclick=function(){ finishCardEdit(card); }; }
}
function finishCardEdit(card){
  if(!card) return;
  card.removeAttribute('contenteditable');
  card.classList.remove('card-editing');
  const clone=card.cloneNode(true);
  const t=clone.querySelector('.card-tools'); if(t) t.remove();
  localStorage.setItem(cardKeyOf(card.id),clone.innerHTML);
  const b=card.querySelector('.ct-edit');
  if(b){ b.innerHTML=I.pencil; b.title='编辑本卡'; b.onclick=function(){ startCardEdit(card.id); }; }
  if(openEditCard===card) openEditCard=null;
  toast('本卡已保存');
}
// 旧版整页编辑内容 → 逐卡迁移（仅卡片页执行一次）
function initCardContent(){
  if(!pageHasCards()) return;
  const legacy=localStorage.getItem(editKey());
  if(legacy){
    try{
      const box=document.createElement('div'); box.innerHTML=legacy;
      document.querySelectorAll('details.card[id]').forEach(c=>{
        let old=null;
        try{ old=box.querySelector('#'+(window.CSS&&CSS.escape?CSS.escape(c.id):c.id)); }catch(e){}
        if(old) localStorage.setItem(cardKeyOf(c.id),old.innerHTML);
      });
      localStorage.removeItem(editKey());
      console.info('[notes] 已把旧版整页编辑内容迁移为逐卡存储');
    }catch(e){}
  }
  document.querySelectorAll('details.card[id]').forEach(c=>{
    const s=localStorage.getItem(cardKeyOf(c.id));
    if(s){ try{ c.innerHTML=s; }catch(e){} }
  });
}
// 旧式整页编辑（首页/错题本等无卡片页面仍用）
function toggleLegacyEdit(){
  isEditing=!isEditing;
  const btn=document.getElementById('editBtn');
  const content=document.querySelector('.doc');
  if(isEditing){
    content.setAttribute('contenteditable','true');
    content.style.outline='2px dashed var(--brand-1)';
    if(btn){ btn.textContent='保存'; btn.style.background='var(--brand-1)'; btn.style.color='#fff'; }
  } else {
    content.removeAttribute('contenteditable');
    content.style.outline='';
    if(btn){ btn.textContent='编辑'; btn.style.background='var(--bg)'; btn.style.color=''; }
    const clone=content.cloneNode(true);
    const p=clone.querySelector('#reviewPanel'); if(p) p.remove();
    localStorage.setItem(editKey(),clone.innerHTML);
    toast('已保存！');
  }
}

// ---------- 卡片工具条注入 ----------
function updateCardTools(card){
  if(!card||!card.id) return;
  const st=masteryOf(pagePath(),card.id);
  const d=card.querySelector('.ct-master .m-dot');
  if(d) d.className='m-dot'+(st?' s-'+st:'');
  const r=card.querySelector('.ct-review');
  if(r){
    const item=reviewGet(pagePath(),card.id);
    r.classList.toggle('has',!!item);
    r.title=item?('下次复习：'+item.due):'安排复习';
  }
}
function injectCardTools(){
  document.querySelectorAll('details.card[id]').forEach(card=>{
    if(card.querySelector('.card-tools')) return;
    const t=document.createElement('div'); t.className='card-tools';
    t.innerHTML=
      `<button class="ct-btn ct-copy" title="复制本卡链接" onclick="copyCardLink('${card.id}')">${I.copy}</button>`+
      `<button class="ct-btn ct-master" title="掌握度：未学 → 模糊 → 已掌握" onclick="cycleMastery('${card.id}')"><span class="m-dot"></span></button>`+
      `<button class="ct-btn ct-review" title="安排复习" onclick="openReviewPop('${card.id}',this)">${I.clock}</button>`+
      `<button class="ct-btn ct-edit" title="编辑本卡" onclick="startCardEdit('${card.id}')">${I.pencil}</button>`;
    card.appendChild(t);
    updateCardTools(card);
  });
}
function copyCardLink(id){
  const url=location.href.split('#')[0]+'#'+id;
  const done=()=>toast('已复制卡片链接');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(done).catch(()=>fallbackCopy(url,done));
  } else fallbackCopy(url,done);
}
function fallbackCopy(text,done){
  const ta=document.createElement('textarea');
  ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); done(); }catch(e){}
  ta.remove();
}

// ---------- 首页今日复习面板 ----------
function renderHomePanel(){
  if(pagePath()!=='notes.html') return;
  const home=document.getElementById('home'); if(!home) return;
  let panel=document.getElementById('reviewPanel');
  if(!panel){ panel=document.createElement('div'); panel.id='reviewPanel'; home.after(panel); }
  const all=readJSON('review.v2',{});
  const today=todayStr();
  const due=Object.keys(all).map(k=>Object.assign({key:k},all[k])).filter(x=>x.due<=today).sort((a,b)=>a.due<b.due?-1:1);
  const mAll=masteryAll(); let ok=0,blur=0;
  Object.keys(mAll).forEach(k=>{ if(mAll[k]==='ok')ok++; else if(mAll[k]==='blur')blur++; });
  const root=siteRoot();
  const listHtml=due.length
    ? due.map(x=>{
        const od=daysBetween(x.due,today);
        return `<div class="rv-item"><a href="${root}${x.page}#${x.hash}">${x.title}</a><span class="rv-meta">${x.due}${od>0?` · 逾期${od}天`:''}</span><button class="rv-x" title="移除" onclick="removeReviewItem('${x.key.replace(/'/g,'')}')">×</button></div>`;
      }).join('')
    : '<div class="rv-empty">今日没有到期卡片。在任意卡片右上角点亮"复习"图标排期，到期会出现在这里。</div>';
  panel.innerHTML=`<div class="rv-head"><span class="rv-title">今日复习</span><span class="rv-date">${today}</span></div>`
    +`<div class="rv-stats"><span>已掌握 <b>${ok}</b></span><span>模糊 <b>${blur}</b></span><span>已排期 <b>${Object.keys(all).length}</b></span><span class="rv-due">今日到期 <b>${due.length}</b></span></div>`
    +`<div class="rv-list">${listHtml}</div>`;
}
function removeReviewItem(key){
  const all=readJSON('review.v2',{});
  delete all[key]; writeJSON('review.v2',all); renderHomePanel();
}

// ---------- 侧边栏渲染（单一数据源：NAV_DATA） ----------
const NAV_OPEN_KEY='nav.open.v2';
function renderNav(){
  const box=document.getElementById('sidebarNav');
  if(!box||typeof NAV_DATA==='undefined') return;
  const root=siteRoot(), page=pagePath();
  const curHash=location.hash?decodeURIComponent(location.hash.slice(1)):'';
  const mAll=masteryAll();
  const navOpen=readJSON(NAV_OPEN_KEY,{});

  function dotHtml(pid,h){
    const st=mAll[pid+'#'+h];
    return `<span class="m-dot${st?' s-'+st:''}"></span>`;
  }
  function linkHtml(l){
    const parts=l.u.split('#');
    const p=parts[0], h=parts[1]||'';
    const same=(p===page);
    let cls='sec-link', attr, extra='';
    if(same){
      if(h?(h===curHash):true) cls+=' on';
      attr=h?` href="#${h}" onclick="scrollToSec('${h}');return false"`:' href="#" data-self="1" onclick="scrollToTop();return false"';
    } else {
      attr=` href="${root}${l.u}"`;
    }
    if(h) extra=` data-hash="${escAttr(h)}" data-mkey="${escAttr(p+'#'+h)}"`;
    const dot=h?dotHtml(p,h):'';
    return `<a class="${cls}"${attr}${extra}>${l.t}${l.n?` <i>${l.n}</i>`:''}${dot}</a>`;
  }
  function openCls(key,auto){ return (navOpen[key]!==undefined?navOpen[key]:auto)?' open':''; }

  function renderItems(items,path,depth){
    let html='',cur=false;
    (items||[]).forEach(it=>{
      const key=path+'/'+it.t;
      if(it.disabled){
        html+=`<div class="gt2 disabled">${it.t}${it.n?` <i>${it.n}</i>`:''}</div>`;
        return;
      }
      if(it.links){
        it.links.forEach(l=>{ if(l.u.split('#')[0]===page) cur=true; });
        const o=openCls(key,it.links.some(l=>l.u.split('#')[0]===page));
        const pad=depth>=3?' style="padding-left:20px"':'';
        html+=`<div class="gt2${o}" data-key="${escAttr(key)}" onclick="toggleGroup(this)">${it.t}${it.n?` <i>${it.n}</i>`:''} <span class="arrow">▾</span></div>`
             +`<div class="group-inner2${o}"${pad}>${it.links.map(linkHtml).join('')}</div>`;
        return;
      }
      if(it.children){
        const sub=renderItems(it.children,key,depth+1);
        if(sub.cur) cur=true;
        const o=openCls(key,sub.cur);
        html+=`<div class="gt2${o}" data-key="${escAttr(key)}" onclick="toggleGroup(this)">${it.t}${it.n?` <i>${it.n}</i>`:''} <span class="arrow">▾</span></div>`
             +`<div class="group-inner2${o}">${sub.html}</div>`;
      }
    });
    return {html,cur};
  }

  let html='';
  NAV_DATA.forEach(g=>{
    if(g.home){
      const same=(page===g.u.split('#')[0]);
      html+=same
        ?`<a class="sec-link on" href="#" data-self="1" onclick="scrollToTop();return false"><span class="gt-l">${iconSvg(g.t)}${g.t}</span></a>`
        :`<a class="sec-link" href="${root}${g.u}"><span class="gt-l">${iconSvg(g.t)}${g.t}</span></a>`;
      return;
    }
    if(g.links){
      const o=openCls(g.t,g.links.some(l=>l.u.split('#')[0]===page));
      html+=`<div class="group"><div class="gt${o}" data-key="${escAttr(g.t)}" onclick="toggleGroup(this)"><span class="gt-l">${iconSvg(g.t)}${g.t}</span> <span class="arrow">▾</span></div>`
           +`<div class="group-inner${o}">${g.links.map(linkHtml).join('')}</div></div>`;
      return;
    }
    const sub=renderItems(g.children,g.t,2);
    const o=openCls(g.t,sub.cur);
    html+=`<div class="group"><div class="gt${o}" data-key="${escAttr(g.t)}" onclick="toggleGroup(this)"><span class="gt-l">${iconSvg(g.t)}${g.t}</span> <span class="arrow">▾</span></div>`
         +`<div class="group-inner${o}">${sub.html}</div></div>`;
  });
  box.innerHTML=html;
}

// ---------- 侧边栏 scrollspy：滚动时高亮当前卡片 ----------
let spyLinks=[];
function initSpy(){
  spyLinks=[];
  document.querySelectorAll('#sidebarNav .sec-link[data-hash]').forEach(a=>{
    const t=document.getElementById(a.dataset.hash);
    if(t) spyLinks.push({el:a,target:t});
  });
  spyLinks.sort((a,b)=>(a.target.compareDocumentPosition(b.target)&Node.DOCUMENT_POSITION_FOLLOWING)?-1:1);
}
function spy(){
  if(!spyLinks.length) return;
  const line=window.innerHeight*0.28;
  let cur=null;
  spyLinks.forEach(s=>{ if(s.target.getBoundingClientRect().top<=line) cur=s; });
  spyLinks.forEach(s=>s.el.classList.remove('on'));
  if(cur){
    cur.el.classList.add('on');
  } else {
    const self=document.querySelector('#sidebarNav .sec-link[data-self]');
    if(self) self.classList.add('on');
  }
}

// ---------- 卡片闪烁（跳转反馈） ----------
function flashTarget(el){
  setTimeout(()=>{
    const inner=Array.from(el.querySelectorAll('.card, .plus-box'));
    const cards=el.classList.contains('card')?[el,...inner]:inner;
    cards.forEach(c=>{
      c.style.transition='background-color 0.6s ease-in-out';
      c.style.backgroundColor='var(--brand-soft)';
      setTimeout(()=>{ c.style.backgroundColor=''; },1500);
    });
  },300);
}

// ---------- 全站搜索（下拉跨页跳转 + 页内卡片过滤） ----------
let searchDD=null, searchIndexData=null, ddItems=[], ddSel=-1;
function initSearch(){
  const wrap=document.querySelector('.search');
  const input=document.getElementById('searchInput');
  if(!wrap||!input) return;
  searchDD=document.createElement('div'); searchDD.className='search-dd'; wrap.appendChild(searchDD);
  fetch(siteRoot()+'search-index.json').then(r=>r.ok?r.json():null).then(d=>{ searchIndexData=d; }).catch(()=>{ searchIndexData=null; });
  input.addEventListener('input',function(e){
    const q=e.target.value.trim().toLowerCase();
    document.querySelectorAll('.card').forEach(c=>{
      if(!q){ c.classList.remove('hidden-card'); return; }
      c.classList.toggle('hidden-card',!c.textContent.toLowerCase().includes(q));
    });
    if(!q){ hideDD(); return; }
    showDD(q);
  });
  input.addEventListener('keydown',onSearchKey);
  document.addEventListener('click',e=>{ if(!wrap.contains(e.target)) hideDD(); });
}
function fetchMatch(q){
  if(!searchIndexData) return [];
  const scored=[];
  searchIndexData.forEach(it=>{
    const t=it.title.toLowerCase(), k=(it.keywords||'').toLowerCase();
    let s=0;
    if(t.startsWith(q)) s=3; else if(t.includes(q)) s=2;
    if(k.includes(q)) s=Math.max(s,1);
    if(s) scored.push({s:s,it:it});
  });
  scored.sort((a,b)=>b.s-a.s);
  return scored.slice(0,8).map(x=>x.it);
}
function hlTitle(text,q){
  const i=text.toLowerCase().indexOf(q);
  if(i<0) return text;
  return text.slice(0,i)+'<mark>'+text.slice(i,i+q.length)+'</mark>'+text.slice(i+q.length);
}
function showDD(q){
  ddItems=fetchMatch(q); ddSel=-1;
  if(!ddItems.length){ searchDD.innerHTML='<div class="s-empty">没有匹配的结果</div>'; searchDD.classList.add('show'); return; }
  const root=siteRoot();
  searchDD.innerHTML=ddItems.map((it,i)=>{
    const hp=it.url.split('#')[0];
    return `<a class="s-item" href="${root}${it.url}"><span class="s-t">${hlTitle(it.title,q)}</span><span class="s-p">${hp}</span></a>`;
  }).join('');
  searchDD.classList.add('show');
}
function hideDD(){ if(searchDD) searchDD.classList.remove('show'); }
function onSearchKey(e){
  const q=searchInput0().value.trim().toLowerCase();
  if(!searchDD.classList.contains('show')){
    if(e.key==='Enter'&&q){ showDD(q); if(ddItems.length) location.href=siteRoot()+ddItems[0].url; }
    return;
  }
  const items=searchDD.querySelectorAll('.s-item');
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    e.preventDefault();
    ddSel+=e.key==='ArrowDown'?1:-1;
    if(ddSel<0) ddSel=items.length-1;
    if(ddSel>=items.length) ddSel=0;
    items.forEach((el,i)=>el.classList.toggle('sel',i===ddSel));
    if(items[ddSel]) items[ddSel].scrollIntoView({block:'nearest'});
  } else if(e.key==='Enter'){
    const pick=ddSel>=0?ddItems[ddSel]:ddItems[0];
    if(pick) location.href=siteRoot()+pick.url;
  } else if(e.key==='Escape'){ hideDD(); }
}
function searchInput0(){ return document.getElementById('searchInput'); }

// ---------- 跳转：自动展开目标卡片 + 目标自身闪烁 ----------
function scrollToSec(id){
  const el=document.getElementById(id);
  if(!el) return;
  if(window.innerWidth<=960){
    document.getElementById('sidebar').classList.remove('open');
    const bd=document.getElementById('sidebarBackdrop');
    if(bd) bd.classList.remove('show');
  }
  let n=el;
  while(n){ if(n.tagName==='DETAILS') n.open=true; n=n.parentElement; }
  el.scrollIntoView({behavior:'smooth',block:'start'});
  flashTarget(el);
}

// ---------- 专业词汇解释（含视口边缘翻转） ----------
function showTermTip(el,text){
  document.querySelectorAll('.term-tip').forEach(t=>t.remove());
  const tip=document.createElement('div');
  tip.className='term-tip show';
  tip.textContent=text;
  tip.style.visibility='hidden';
  document.body.appendChild(tip);
  const rect=el.getBoundingClientRect();
  const tw=tip.offsetWidth, th=tip.offsetHeight;
  let left=Math.max(8,Math.min(rect.left,window.innerWidth-tw-12));
  let top=rect.bottom+8;
  if(top+th>window.innerHeight-8) top=Math.max(8,rect.top-th-8);
  tip.style.left=left+'px'; tip.style.top=top+'px'; tip.style.visibility='';
  setTimeout(()=>{
    document.addEventListener('click',function close(e){
      if(!tip.contains(e.target)&&e.target!==el){ tip.remove(); document.removeEventListener('click',close); }
    });
  },0);
}

// ---------- 因果传导链组件：把 .chain 内的「A → B → C」渲染成步骤条 ----------
function enhanceChains(){
  document.querySelectorAll('.chain').forEach(box=>{
    if(box.dataset.chainDone) return;
    box.dataset.chainDone='1';
    const frag=document.createDocumentFragment();
    let needArrow=false;
    function pushStep(text,cls){
      const t=(text||'').trim();
      if(!t) return;
      if(needArrow){ const a=document.createElement('span'); a.className='chain-arrow'; a.textContent='→'; frag.appendChild(a); }
      const s=document.createElement('span');
      s.className='chain-step'+(cls?' '+cls:'');
      s.textContent=t;
      frag.appendChild(s);
      needArrow=true;
    }
    Array.from(box.childNodes).forEach(node=>{
      if(node.nodeType===3){
        node.textContent.split('→').forEach(t=>pushStep(t,''));
      } else if(node.nodeType===1){
        if(node.classList.contains('chain-note')){
          const n=document.createElement('span'); n.className='chain-note'; n.textContent=node.textContent.trim();
          frag.appendChild(n); needArrow=false;
          return;
        }
        const cls=node.classList.contains('em-old')?'chain-bad':(node.classList.contains('em-new')?'chain-hl':'');
        node.textContent.split('→').forEach(t=>pushStep(t,cls));
      }
    });
    box.innerHTML='';
    box.appendChild(frag);
  });
}

// ---------- 板块页一键展开/收起 ----------
function initFoldToggle(){
  const dh=document.querySelector('.doc-head');
  const cards=Array.from(document.querySelectorAll('details.card[id]'));
  if(!dh||cards.length<3) return;
  const b=document.createElement('button');
  b.className='fold-toggle'; b.textContent='展开全部';
  b.onclick=function(){
    const anyClosed=cards.some(c=>!c.open);
    cards.forEach(c=>c.open=anyClosed);
    b.textContent=anyClosed?'收起全部':'展开全部';
  };
  dh.appendChild(b);
}

// ---------- 深色模式 ----------
function applyTheme(dark,save){
  document.documentElement.setAttribute('data-theme',dark?'dark':'light');
  if(save) localStorage.setItem('theme',dark?'dark':'light');
  const b=document.getElementById('themeBtn');
  if(b){ b.innerHTML=dark?I.sun:I.moon; b.title=dark?'切换到浅色模式':'切换到深色模式'; }
}
function initTheme(){
  const saved=localStorage.getItem('theme');
  const dark=saved?saved==='dark':(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches);
  const nav=document.querySelector('.nav');
  if(nav&&!document.getElementById('themeBtn')){
    const b=document.createElement('button');
    b.id='themeBtn';
    b.onclick=()=>applyTheme(document.documentElement.getAttribute('data-theme')!=='dark',true);
    const edit=document.getElementById('editBtn');
    if(edit) nav.insertBefore(b,edit); else nav.appendChild(b);
  }
  applyTheme(dark,false);
}

// ---------- 页面骨架：进度条 / 回到顶部 / 移动端工具栏 ----------
function initChrome(){
  if(!document.getElementById('progressBar')){
    const bar=document.createElement('div'); bar.id='progressBar'; document.body.appendChild(bar);
  }
  if(!document.getElementById('backTop')){
    const bt=document.createElement('button');
    bt.id='backTop'; bt.title='回到顶部'; bt.innerHTML=I.up;
    bt.onclick=scrollToTop;
    document.body.appendChild(bt);
  }
  if(!document.getElementById('mToolbar')){
    const tb=document.createElement('div'); tb.id='mToolbar';
    tb.innerHTML=
      `<button onclick="toggleSidebar()">${I.list}目录</button>`+
      `<button onclick="focusSearch()">${I.search}搜索</button>`+
      `<button onclick="scrollToTop()">${I.up}顶部</button>`;
    document.body.appendChild(tb);
  }
}
function focusSearch(){
  const i=document.getElementById('searchInput');
  if(i){ window.scrollTo({top:0,behavior:'smooth'}); setTimeout(()=>i.focus(),200); }
}
let ticking=false;
window.addEventListener('scroll',function(){
  if(!ticking){ requestAnimationFrame(function(){ onScrollFX(); ticking=false; }); ticking=true; }
},{passive:true});
function onScrollFX(){
  const st=window.scrollY||document.documentElement.scrollTop||0;
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const bar=document.getElementById('progressBar');
  if(bar) bar.style.width=(max>0?(st/max*100):0)+'%';
  const bt=document.getElementById('backTop');
  if(bt) bt.classList.toggle('show',st>400);
  spy();
}

// ---------- 概念深挖总览页（知识网络枢纽，数据源 js/concepts.js） ----------
const HUB_MASTERY_KEY='mastery.v2:concepts-overview';
function hubMastery(){ return readJSON(HUB_MASTERY_KEY,{}); }
function setHubMastery(path,st){
  const m=hubMastery();
  if(st) m[path]=st; else delete m[path];
  writeJSON(HUB_MASTERY_KEY,m);
}
function hubStatusText(st){ return st==='ok'?'已掌握':st==='blur'?'模糊':'未学'; }
function renderHubStat(){
  let total=0,ok=0,blur=0;
  document.querySelectorAll('#conceptHub .hub-card').forEach(c=>{
    total++;
    if(c.dataset.st==='ok')ok++;
    if(c.dataset.st==='blur')blur++;
  });
  const stat=document.getElementById('hubStat');
  if(stat) stat.innerHTML=`共 <b>${total}</b> 个概念 · 已掌握 <b>${ok}</b> · 模糊 <b>${blur}</b> · 未学 <b>${total-ok-blur}</b>`;
}
function renderConceptHub(){
  const box=document.getElementById('conceptHub');
  if(!box||typeof CONCEPTS_DATA==='undefined') return;
  const m=hubMastery();
  let html='';
  CONCEPTS_DATA.forEach(sub=>{
    let subHtml='';
    (sub.groups||[]).forEach(g=>{
      let cards='';
      (g.concepts||[]).forEach(c=>{
        const st=m[c.u]||'';
        cards+=`<a class="hub-card${st?' st-'+st:''}" data-st="${st}" href="${siteRoot()+c.u}">`
             + `<span class="hub-mark" data-u="${c.u}" data-st="${st}" title="点击切换掌握度：未学 → 模糊 → 已掌握">${hubStatusText(st)}</span>`
             + `<span class="hub-row"><span class="hub-dot ${st||'no'}"></span><span class="hub-name">${c.t}</span></span>`
             + (c.desc?`<span class="hub-desc">${c.desc}</span>`:'')
             + `</a>`;
      });
      if(!cards) return;
      subHtml+=`<div class="hub-group"><div class="hub-grow"><span class="hub-gt">${g.card}</span>`
              + `<a class="hub-jump" href="${siteRoot()+g.u}">跳正文 →</a></div>`
              + `<div class="hub-grid">${cards}</div></div>`;
    });
    if(!subHtml) return;
    html+=`<div class="hub-subject"><span class="hub-ico">${sub.icon||sub.subject.slice(0,1)}</span>${sub.subject}</div>`+subHtml;
  });
  box.innerHTML=html;
  renderHubStat();
}
// 总览页：掌握度循环标记（事件委托；标记按钮在链接卡内，需阻断跳转）
document.addEventListener('click',function(e){
  const mk=e.target.closest('.hub-mark');
  if(!mk) return;
  e.preventDefault();
  e.stopPropagation();
  const u=mk.dataset.u;
  const next=MASTERY_ORDER[(MASTERY_ORDER.indexOf(mk.dataset.st||'')+1)%3];
  setHubMastery(u,next);
  mk.dataset.st=next;
  mk.textContent=hubStatusText(next);
  const card=mk.closest('.hub-card');
  card.dataset.st=next;
  card.classList.remove('st-blur','st-ok');
  if(next) card.classList.add('st-'+next);
  const dot=card.querySelector('.hub-dot');
  if(dot) dot.className='hub-dot '+(next||'no');
  renderHubStat();
});
// 总览页：掌握度过滤
document.addEventListener('click',function(e){
  const chip=e.target.closest('.hub-chip');
  if(!chip) return;
  document.querySelectorAll('.hub-filters .hub-chip').forEach(c=>c.classList.toggle('on',c===chip));
  const f=chip.dataset.f;
  document.querySelectorAll('#conceptHub .hub-card').forEach(c=>{
    c.style.display=(f==='all'||(c.dataset.st||'none')===f)?'':'none';
  });
});

// ---------- 页面加载 ----------
window.addEventListener('load',function(){
  initTheme();
  renderNav();
  initCardContent();
  injectCardTools();
  initSpy();
  initFoldToggle();
  enhanceChains();
  renderConceptHub();
  // 子页面返回按钮：面包屑行首注入，优先浏览器历史返回，无历史则回首页
  const crumb=document.querySelector('.crumb');
  if(crumb&&siteRoot()!==''){
    const back=document.createElement('a');
    back.className='back-btn';
    back.href='#';
    back.textContent='← 返回';
    back.onclick=function(e){
      e.preventDefault();
      if(history.length>1){ history.back(); }
      else { location.href=siteRoot()+'notes.html'; }
    };
    crumb.insertBefore(back,crumb.firstChild);
  }
  // 旧式整页编辑内容回填（仅无卡片页面）
  if(!pageHasCards()){
    const saved=localStorage.getItem(editKey());
    if(saved){
      const doc=document.querySelector('.doc');
      if(doc) doc.innerHTML=saved;
    }
  }
  // 跨页锚点：自动展开目标 details（含祖先）并滚动到位
  if(location.hash){
    const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if(el){
      let n=el;
      while(n){ if(n.tagName==='DETAILS') n.open=true; n=n.parentElement; }
      setTimeout(()=>{ el.scrollIntoView({behavior:'smooth',block:'start'}); flashTarget(el); },60);
    }
  }
  initChrome();
  initSearch();
  renderHomePanel();
  onScrollFX();
});

// ---------- 侧边栏收起/展开（桌面=停靠收起，移动端=抽屉） ----------
function toggleSidebar(){
  const sb=document.getElementById('sidebar');
  const bd=document.getElementById('sidebarBackdrop');
  if(window.innerWidth<=960){
    const open=sb.classList.toggle('open');
    if(bd) bd.classList.toggle('show',open);
  } else {
    sb.classList.toggle('collapsed');
  }
}
function toggleGroup(el){
  const open=el.classList.toggle('open');
  const inner=el.nextElementSibling;
  if(inner&&inner.classList.contains('group-inner')) inner.classList.toggle('open',open);
  if(inner&&inner.classList.contains('group-inner2')) inner.classList.toggle('open',open);
  if(el.dataset.key){
    const s=readJSON(NAV_OPEN_KEY,{});
    s[el.dataset.key]=open;
    writeJSON(NAV_OPEN_KEY,s);
  }
}
// 侧边栏拖动调整宽度
let isResizing=false;
const sidebarResize=document.getElementById('sidebarResize');
if(sidebarResize){
  sidebarResize.addEventListener('mousedown',function(){
    isResizing=true;
    document.body.style.cursor='col-resize';
  });
}
document.addEventListener('mousemove',function(e){
  if(!isResizing) return;
  const w=Math.max(180,Math.min(360,e.clientX));
  document.documentElement.style.setProperty('--side-w',w+'px');
});
document.addEventListener('mouseup',function(){
  isResizing=false;
  document.body.style.cursor='';
});
// 侧边栏分组默认全部收起；含当前页链接的分组自动展开，用户手动开合状态会被记忆
function scrollToTop(){ window.scrollTo({top:0,behavior:'smooth'}); }
