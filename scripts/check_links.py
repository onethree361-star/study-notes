# -*- coding: utf-8 -*-
"""全站断链检查（CI 与本地通用，任一失败退出码为 1）。

检查三类引用（对应项目规则：导航 / 锚点 / search-index.json 三处必须同步）：
  1. js/nav.js        所有 u:'...' → 页面文件存在 + 跨页锚点 id 存在
  2. search-index.json 所有 url    → 同上
  3. 各 .html 页面内  href="..." 与 scrollToSec('...') → 相对路径解析后存在，锚点存在

约定：nav.js / search-index 的路径相对站点根；页面内 href 相对该页面；纯 #anchor 为同页锚点。
"""
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
EXCLUDE_PARTS = {'.git', 'node_modules', '.github', 'scripts'}
EXCLUDE_FILES = {'公考备考笔记 - 副本.html', 'concepts/_template.html'}  # 旧备份与源模板不纳入
problems = []
checked = 0

_id_cache = {}

def is_placeholder(target: str) -> bool:
    """模板/注释里的占位示例，如 【域】/【概念页】.html、页面路径#卡片id。"""
    return ('【' in target) or ('】' in target) or (target == '页面路径#卡片id')

def ids_of(path: Path):
    """返回文件内全部 id 集合；文件不存在返回 None。"""
    key = path.resolve()
    if key not in _id_cache:
        if not path.exists():
            _id_cache[key] = None
        else:
            try:
                text = path.read_text(encoding='utf-8')
            except UnicodeDecodeError:
                text = path.read_text(encoding='gbk', errors='ignore')
            _id_cache[key] = set(re.findall(r'\bid=["\']([^"\']+)["\']', text))
    return _id_cache[key]

def norm(p: Path) -> str:
    return p.resolve().as_posix()

def check_ref(src_label: str, same_page: Path, base_dir: Path, target: str):
    """校验一个引用目标；target 形如 pages/x.html#anchor、../../a.html、#anchor。
    same_page：纯 #anchor 时指向的页面文件本身。"""
    global checked
    target = unquote((target or '').strip())
    if not target or target in ('#',) or target.startswith(('http://', 'https://', 'javascript:', 'mailto:', 'data:')):
        return
    if is_placeholder(target):
        return
    file_part, _, anchor = target.partition('#')
    if file_part:
        fpath = (base_dir / file_part)
        # 折叠 ../ 与 ./
        fpath = Path(*[seg for seg in fpath.parts if seg not in ('.',)])
        try:
            resolved = fpath.resolve()
        except OSError:
            problems.append(f'[bad-path] {src_label} -> {target}')
            return
        if ROOT.resolve() not in resolved.parents and resolved != ROOT.resolve():
            problems.append(f'[outside-root] {src_label} -> {target}')
            return
        if not resolved.exists():
            problems.append(f'[missing-file] {src_label} -> {target}')
            return
        checked += 1
    else:
        # 纯 #anchor：同页引用，指向页面文件本身
        resolved = same_page
    if anchor:
        ids = ids_of(resolved)
        if ids is None:
            problems.append(f'[missing-file] {src_label} -> {target}')
        elif anchor not in ids:
            problems.append(f'[missing-anchor] {src_label} -> {target}')
        else:
            checked += 1

def iter_html():
    for p in ROOT.rglob('*.html'):
        if EXCLUDE_PARTS & set(p.parts):
            continue
        if p.name in EXCLUDE_FILES or p.relative_to(ROOT).as_posix() in EXCLUDE_FILES:
            continue
        yield p

# ---- 1) nav.js（去掉 // 注释行再扫，避免扫到规则注释里的示例） ----
nav_text = (ROOT / 'js' / 'nav.js').read_text(encoding='utf-8')
nav_code = re.sub(r'^\s*//.*$', '', nav_text, flags=re.M)
for m in re.finditer(r"u:\s*'([^']+)'", nav_code):
    check_ref('js/nav.js', ROOT / 'notes.html', ROOT, m.group(1))

# ---- 2) search-index.json ----
idx_path = ROOT / 'search-index.json'
if idx_path.exists():
    try:
        for item in json.loads(idx_path.read_text(encoding='utf-8')):
            check_ref('search-index.json', ROOT / 'notes.html', ROOT, item.get('url', ''))
    except json.JSONDecodeError as e:
        problems.append(f'[bad-json] search-index.json: {e}')

# ---- 3) 各页面 href / scrollToSec ----
for html in iter_html():
    rel = html.relative_to(ROOT).as_posix()
    try:
        text = html.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        text = html.read_text(encoding='gbk', errors='ignore')
    for m in re.finditer(r'href=["\']([^"\']+)["\']', text):
        href = m.group(1)
        if href.startswith(('http://', 'https://', 'javascript:', 'mailto:')):
            continue
        check_ref(rel, html, html.parent, href)
    # scrollToSec 均为同页锚点跳转
    ids = ids_of(html) or set()
    for m in re.finditer(r"scrollToSec\('([^']+)'\)", text):
        if m.group(1) not in ids:
            problems.append(f'[missing-anchor] {rel} -> scrollToSec(\'{m.group(1)}\')')

# ---- 汇总 ----
if problems:
    print(f'FAIL: {len(problems)} 个断链（共校验 {checked} 处有效引用）')
    for p in problems:
        print(' -', p)
    sys.exit(1)
print(f'OK: 全站零断链（共校验 {checked} 处有效引用）')
