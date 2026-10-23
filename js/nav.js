/* ===== 全站导航数据源（唯一事实来源） =====
 * 规则（AI 添加内容时必须同步维护本文件）：
 * 1. 所有 URL 一律相对站点根目录书写（如 pages/finance/index.html#sec-jinrong-c2），
 *    渲染时由 app.js 自动加 SITE_ROOT 前缀，首页与各子页通用。
 * 2. 新增板块卡片 → 在对应领域 links 里加 {t:'标题', u:'页面路径#卡片id', n:'数量'}。
 * 3. 新增概念深潜页 → 在「概念深潜」对应域加链接，并在板块页加 deep-link 入口。
 * 4. 新增错题页 → 在「错题本」加链接。
 * 5. u 中 # 后面是目标锚点 id；与本页 PATH 相同的链接会自动转为页内平滑跳转。
 */
const NAV_DATA = [
  { home: true, t: '首页说明', u: '公考备考笔记.html' },

  { t: '公共基础 · 常识', children: [
    { t: '历史人文', links: [
      { t: '远古与夏商西周', u: 'pages/history/ancient.html#sec-1', n: '5' },
      { t: '春秋战国', u: 'pages/history/ancient.html#sec-2', n: '2' },
      { t: '秦汉', u: 'pages/history/ancient.html#sec-3', n: '2' },
      { t: '魏晋南北朝', u: 'pages/history/ancient.html#sec-4', n: '1' },
      { t: '隋唐', u: 'pages/history/ancient.html#sec-5', n: '2' },
      { t: '宋元', u: 'pages/history/ancient.html#sec-6', n: '2' },
      { t: '明清', u: 'pages/history/ancient.html#sec-7', n: '2' },
      { t: '近现代史', u: 'pages/history/modern.html#sec-jindai', n: '42' },
    ]},
    { t: '法律', n: '4', children: [
      { t: '宪法', n: '2', links: [
        { t: '宪法谱系', u: 'pages/law/constitution.html#sec-xianfa' },
        { t: '八二宪法具体知识点', u: 'pages/law/constitution.html#sec-xianfa-detail' },
      ]},
      { t: '民法', n: '10', links: [
        { t: '民法谱系', u: 'pages/law/civil.html#sec-minfa' },
        { t: '民法具体知识点', u: 'pages/law/civil.html#sec-minfa-detail' },
      ]},
      { t: '刑法', n: '2', links: [
        { t: '刑法谱系', u: 'pages/law/criminal.html#sec-xingfa' },
        { t: '刑法具体知识点', u: 'pages/law/criminal.html#sec-xingfa-detail' },
      ]},
      { t: '公司法', n: '3', links: [
        { t: '公司法谱系', u: 'pages/law/company.html#sec-gongsi' },
        { t: '公司法具体知识点', u: 'pages/law/company.html#sec-gongsi-detail' },
      ]},
    ]},
  ]},

  { t: '经济', children: [
    { t: '宏观经济', n: '1', links: [
      { t: '宏观经济学完整框架', u: 'pages/economy/macro.html#sec-hongguan' },
    ]},
    { t: '微观经济', n: '1', links: [
      { t: '微观经济学完整框架', u: 'pages/economy/micro.html#sec-weiguan' },
    ]},
  ]},

  { t: '金融学', children: [
    { t: '金融体系', n: '12', links: [
      { t: '发生学：为什么有金融学', u: 'pages/finance/index.html#sec-jinrong-c1' },
      { t: '① 金融机构体系', u: 'pages/finance/index.html#sec-jinrong-c2' },
      { t: '② 金融市场体系', u: 'pages/finance/index.html#sec-jinrong-c3' },
      { t: '③ 金融工具体系', u: 'pages/finance/index.html#sec-jinrong-c4' },
      { t: '④ 货币供求与乘数', u: 'pages/finance/index.html#sec-jinrong-c5' },
      { t: '⑤ 货币政策与传导', u: 'pages/finance/index.html#sec-jinrong-c6' },
      { t: '⑥ 国际金融', u: 'pages/finance/index.html#sec-jinrong-c7' },
      { t: '⑦ 资产定价机制', u: 'pages/finance/index.html#sec-jinrong-c8' },
      { t: '⑧ 金融风险类型', u: 'pages/finance/index.html#sec-jinrong-c9' },
      { t: '⑨ 金融监管体系', u: 'pages/finance/index.html#sec-jinrong-c10' },
      { t: '发生学迭代：四次进化', u: 'pages/finance/index.html#sec-jinrong-c11' },
      { t: '因果传导链：三条链', u: 'pages/finance/index.html#sec-jinrong-c12' },
    ]},
  ]},

  { t: '概念深潜', children: [
    { t: '金融', links: [
      { t: '商业银行的业务（三驾马车）', u: 'concepts/finance/commercial-bank.html' },
    ]},
  ]},

  { t: '错题本', children: [
    { t: '按考法分类', links: [
      { t: '错题总览', u: 'errors/index.html' },
    ]},
    { t: '按领域分类', links: [
      { t: '历史人文', u: 'errors/history.html' },
      { t: '法律', u: 'errors/law.html' },
      { t: '经济', u: 'errors/economy.html' },
      { t: '金融', u: 'errors/finance.html' },
    ]},
  ]},

  { t: '政治理论', children: [
    { t: '党史（历次代表大会）', disabled: true, n: '待更新' },
    { t: '政策文件与重要讲话', disabled: true, n: '待更新' },
    { t: '马克思主义中国化', disabled: true, n: '待更新' },
  ]},

  { t: '行测', children: [
    { t: '言语理解', disabled: true, n: '待更新' },
    { t: '判断推理', disabled: true, n: '待更新' },
    { t: '数量关系', disabled: true, n: '待更新' },
    { t: '资料分析', disabled: true, n: '待更新' },
  ]},

  { t: '总结', links: [
    { t: '未来时政联动', u: '公考备考笔记.html#sec-future', n: '6' },
  ]},
];
