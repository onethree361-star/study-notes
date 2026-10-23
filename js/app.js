/* ===== 公考备考笔记 · 共享脚本 =====
 * 依赖：js/nav.js（NAV_DATA 导航数据源，需先于本文件引入）
 * 页面约定：每个页面在 <head> 里定义
 *   window.SITE_ROOT = ''（首页）或 '../../'（二级子页）
 *   window.PAGE_PATH = 本页相对根目录路径（如 'pages/finance/index.html'）
 */

// ---------- 侧边栏渲染（单一数据源：NAV_DATA） ----------
function renderNav(){
  const box = document.getElementById('sidebarNav');
  if(!box || typeof NAV_DATA === 'undefined') return;
  const root = window.SITE_ROOT || '';
  const page = window.PAGE_PATH || '公考备考笔记.html';
  const curHash = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';

  function linkHtml(l){
    const parts = l.u.split('#');
    const p = parts[0], h = parts[1] || '';
    const same = (p === page);
    let cls = 'sec-link', attr;
    if(same){
      if(h ? (h === curHash) : true) cls += ' on';
      attr = h ? ` href="#${h}" onclick="scrollToSec('${h}');return false"` : ' href="#" onclick="scrollToTop();return false"';
    } else {
      attr = ` href="${root}${l.u}"`;
    }
    return `<a class="${cls}"${attr}>${l.t}${l.n ? ` <i>${l.n}</i>` : ''}</a>`;
  }

  // 渲染一组 item（gt2 级），返回 {html, cur}；cur=本组是否含当前页链接
  function renderItems(items, depth){
    let html = '', cur = false;
    (items || []).forEach(it => {
      if(it.disabled){
        html += `<div class="gt2 disabled">${it.t}${it.n ? ` <i>${it.n}</i>` : ''}</div>`;
        return;
      }
      if(it.links){
        const linksHtml = it.links.map(l => { if(l.u.split('#')[0] === page) cur = true; return linkHtml(l); }).join('');
        const open = it.links.some(l => l.u.split('#')[0] === page) ? ' open' : '';
        const pad = depth >= 3 ? ' style="padding-left:20px"' : '';
        html += `<div class="gt2${open}" onclick="toggleGroup(this)">${it.t}${it.n ? ` <i>${it.n}</i>` : ''} <span class="arrow">▾</span></div>`
              + `<div class="group-inner2${open}"${pad}>${linksHtml}</div>`;
        return;
      }
      if(it.children){
        const sub = renderItems(it.children, depth + 1);
        if(sub.cur) cur = true;
        const open = sub.cur ? ' open' : '';
        html += `<div class="gt2${open}" onclick="toggleGroup(this)">${it.t}${it.n ? ` <i>${it.n}</i>` : ''} <span class="arrow">▾</span></div>`
              + `<div class="group-inner2${open}">${sub.html}</div>`;
      }
    });
    return { html, cur };
  }

  let html = '';
  NAV_DATA.forEach(g => {
    if(g.home){
      const same = (page === g.u.split('#')[0]);
      html += same
        ? `<a class="sec-link on" href="#" onclick="scrollToTop();return false">${g.t}</a>`
        : `<a class="sec-link" href="${root}${g.u}">${g.t}</a>`;
      return;
    }
    if(g.links){
      const linksHtml = g.links.map(l => { return linkHtml(l); }).join('');
      const open = g.links.some(l => l.u.split('#')[0] === page) ? ' open' : '';
      html += `<div class="group"><div class="gt${open}" onclick="toggleGroup(this)">${g.t} <span class="arrow">▾</span></div>`
            + `<div class="group-inner${open}">${linksHtml}</div></div>`;
      return;
    }
    const sub = renderItems(g.children, 2);
    const open = sub.cur ? ' open' : '';
    html += `<div class="group"><div class="gt${open}" onclick="toggleGroup(this)">${g.t} <span class="arrow">▾</span></div>`
          + `<div class="group-inner${open}">${sub.html}</div></div>`;
  });
  box.innerHTML = html;
}

// ---------- 卡片闪烁（跳转反馈） ----------
function flashTarget(el){
  setTimeout(() => {
    const inner = Array.from(el.querySelectorAll('.card, .plus-box'));
    const cards = el.classList.contains('card') ? [el, ...inner] : inner;
    cards.forEach(c => {
      c.style.transition = 'background-color 0.6s ease-in-out';
      c.style.backgroundColor = '#e8f0ea';
      setTimeout(() => { c.style.backgroundColor = ''; }, 1500);
    });
  }, 300);
}

// ---------- 全局搜索 ----------
const searchInput = document.getElementById('searchInput');
if(searchInput){
  searchInput.addEventListener('input', function(e){
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.card').forEach(c => {
      if(!q){ c.classList.remove('hidden-card'); return; }
      c.classList.toggle('hidden-card', !c.textContent.toLowerCase().includes(q));
    });
  });
}

// ---------- 跳转：自动展开目标卡片 + 目标自身闪烁 ----------
function scrollToSec(id){
  const el = document.getElementById(id);
  if(!el) return;
  if(window.innerWidth <= 960){
    document.getElementById('sidebar').classList.remove('open');
    const bd = document.getElementById('sidebarBackdrop');
    if(bd) bd.classList.remove('show');
  }
  // 目标及其祖先 details 全部展开
  let n = el;
  while(n){ if(n.tagName === 'DETAILS') n.open = true; n = n.parentElement; }
  el.scrollIntoView({behavior:'smooth', block:'start'});
  flashTarget(el);
}

// ---------- 专业词汇解释 ----------
function showTermTip(el, text){
  document.querySelectorAll('.term-tip').forEach(t => t.remove());
  const tip = document.createElement('div');
  tip.className = 'term-tip show';
  tip.textContent = text;
  const rect = el.getBoundingClientRect();
  tip.style.left = rect.left + 'px';
  tip.style.top = (rect.bottom + 8) + 'px';
  document.body.appendChild(tip);
  setTimeout(() => {
    document.addEventListener('click', function close(e){
      if(!tip.contains(e.target) && e.target !== el){
        tip.remove();
        document.removeEventListener('click', close);
      }
    });
  }, 0);
}

// ---------- 编辑功能（按页面独立存储，互不覆盖） ----------
let isEditing = false;
function editKey(){ return 'notesContent.v2:' + (window.PAGE_PATH || '公考备考笔记.html'); }
function toggleEdit(){
  isEditing = !isEditing;
  const btn = document.getElementById('editBtn');
  const content = document.querySelector('.doc');
  if(isEditing){
    content.setAttribute('contenteditable','true');
    content.style.outline = '2px dashed var(--brand-1)';
    btn.textContent = '保存';
    btn.style.background = 'var(--brand-1)';
    btn.style.color = '#fff';
  } else {
    content.removeAttribute('contenteditable');
    content.style.outline = '';
    btn.textContent = '编辑';
    btn.style.background = 'var(--bg)';
    btn.style.color = '';
    localStorage.setItem(editKey(), content.innerHTML);
    alert('已保存！');
  }
}

// ---------- 页面加载 ----------
window.addEventListener('load', function(){
  renderNav();
  // 子页面返回按钮：面包屑行首注入，优先浏览器历史返回，无历史则回首页
  const crumb = document.querySelector('.crumb');
  if(crumb && (window.SITE_ROOT || '') !== ''){
    const back = document.createElement('a');
    back.className = 'back-btn';
    back.href = '#';
    back.textContent = '← 返回';
    back.onclick = function(e){
      e.preventDefault();
      if(history.length > 1){ history.back(); }
      else { location.href = window.SITE_ROOT + encodeURIComponent('公考备考笔记.html'); }
    };
    crumb.insertBefore(back, crumb.firstChild);
  }
  // 读取本页保存的编辑内容
  const saved = localStorage.getItem(editKey());
  if(saved){
    document.querySelector('.doc').innerHTML = saved;
  }
  // 跨页锚点：自动展开目标 details（含祖先）并滚动到位
  if(location.hash){
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if(el){
      let n = el;
      while(n){ if(n.tagName === 'DETAILS') n.open = true; n = n.parentElement; }
      setTimeout(() => { el.scrollIntoView({behavior:'smooth', block:'start'}); flashTarget(el); }, 60);
    }
  }
});

// ---------- 侧边栏收起/展开（桌面=停靠收起，移动端=抽屉） ----------
function toggleSidebar(){
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('sidebarBackdrop');
  if(window.innerWidth <= 960){
    const open = sb.classList.toggle('open');
    if(bd) bd.classList.toggle('show', open);
  } else {
    sb.classList.toggle('collapsed');
  }
}
function toggleGroup(el){
  el.classList.toggle('open');
  const inner = el.nextElementSibling;
  if(inner && inner.classList.contains('group-inner')) inner.classList.toggle('open');
  if(inner && inner.classList.contains('group-inner2')) inner.classList.toggle('open');
}
// 侧边栏拖动调整宽度
let isResizing = false;
const sidebarResize = document.getElementById('sidebarResize');
if(sidebarResize){
  sidebarResize.addEventListener('mousedown', function(e){
    isResizing = true;
    document.body.style.cursor = 'col-resize';
  });
}
document.addEventListener('mousemove', function(e){
  if(!isResizing) return;
  const w = Math.max(180, Math.min(360, e.clientX));
  document.documentElement.style.setProperty('--side-w', w + 'px');
});
document.addEventListener('mouseup', function(){
  isResizing = false;
  document.body.style.cursor = '';
});
// 侧边栏分组默认全部收起；含当前页链接的分组由 renderNav 自动展开
function scrollToTop(){ window.scrollTo({top:0, behavior:'smooth'}); }
