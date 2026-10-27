/* ===== 全站导航数据源（唯一事实来源） =====
 * 规则（AI 添加内容时必须同步维护本文件）：
 * 1. 所有 URL 一律相对站点根目录书写（如 pages/finance/finance.html#sec-jinrong-c2），
 *    渲染时由 app.js 自动加 SITE_ROOT 前缀，首页与各子页通用。
 * 2. 新增板块卡片 → 在对应领域 links 里加 {t:'与页面 h3 一致的标题', u:'页面路径#卡片id'}。
 * 3. 新增概念深挖页 → 在「概念深挖」对应域加链接，并在板块页/上级概念页对应知识点容器正下方加 deep-link 入口。
 * 4. 新增错题页 → 在「错题本」加链接。
 * 5. u 中 # 后面是目标锚点 id；与本页 PATH 相同的链接会自动转为页内平滑跳转。
 * 6. 组顺序约定：内容板块在前，工具模块（概念深挖 / 错题本）固定在最下方。
 */
const NAV_DATA = [
  { home: true, t: '首页说明', u: 'notes.html' },

  { t: '公共基础 · 常识', children: [
    { t: '历史人文', children: [
      { t: '古代史', links: [
        { t: '远古与夏商西周', u: 'pages/history/ancient.html#sec-1', n: '5' },
        { t: '春秋战国', u: 'pages/history/ancient.html#sec-2', n: '2' },
        { t: '秦汉', u: 'pages/history/ancient.html#sec-3', n: '2' },
        { t: '魏晋南北朝', u: 'pages/history/ancient.html#sec-4', n: '1' },
        { t: '隋唐', u: 'pages/history/ancient.html#sec-5', n: '2' },
        { t: '宋元', u: 'pages/history/ancient.html#sec-6', n: '2' },
        { t: '明清', u: 'pages/history/ancient.html#sec-7', n: '2' },
      ]},
      { t: '近现代史', n: '42', links: [
        { t: '总览', u: 'pages/history/modern.html#sec-jindai' },
        { t: '一、旧民主主义革命时期', u: 'pages/history/modern.html#sec-jindai-p1' },
        { t: '二、新民主主义革命时期', u: 'pages/history/modern.html#sec-jindai-p2' },
        { t: '三、社会主义革命和建设时期', u: 'pages/history/modern.html#sec-jindai-p3' },
        { t: '四、改革开放新时期', u: 'pages/history/modern.html#sec-jindai-p4' },
        { t: '五、新时代', u: 'pages/history/modern.html#sec-jindai-p5' },
      ]},
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
    { t: '宏观经济学', children: [
      { t: '第一层 · 发生学', links: [
        { t: '01 宏观经济学为什么会诞生', u: 'pages/economy/macro.html#sec-hongguan-c1' },
      ]},
      { t: '第二层 · 结构拆解', links: [
        { t: '02 宏观经济的结构', u: 'pages/economy/macro.html#sec-hongguan-c2' },
        { t: '03 IS-LM 模型', u: 'pages/economy/macro.html#sec-hongguan-c3' },
      ]},
      { t: '第三层 · 发生学迭代', links: [
        { t: '04 为什么框架里会有这些零件', u: 'pages/economy/macro.html#sec-hongguan-c4' },
      ]},
      { t: '第四层 · 因果传导链', links: [
        { t: '05 经济过冷怎么救', u: 'pages/economy/macro.html#sec-hongguan-c5' },
        { t: '06 经济过热怎么压', u: 'pages/economy/macro.html#sec-hongguan-c6' },
        { t: '07 滞胀难题与短期、长期的区别', u: 'pages/economy/macro.html#sec-hongguan-c7' },
        { t: '08 IS-LM 里政策怎么起作用', u: 'pages/economy/macro.html#sec-hongguan-c8' },
      ]},
    ]},
    { t: '微观经济学', children: [
      { t: '第一层 · 发生学', links: [
        { t: '01 微观经济学为什么会诞生', u: 'pages/economy/micro.html#sec-weiguan-c1' },
      ]},
      { t: '第二层 · 结构拆解', links: [
        { t: '02 微观经济的结构', u: 'pages/economy/micro.html#sec-weiguan-c2' },
      ]},
      { t: '第三层 · 发生学迭代', links: [
        { t: '03 从"看不见的手"到"市场失灵"', u: 'pages/economy/micro.html#sec-weiguan-c3' },
      ]},
      { t: '第四层 · 因果传导链', links: [
        { t: '04 价格机制', u: 'pages/economy/micro.html#sec-weiguan-c4' },
        { t: '05 消费者选择', u: 'pages/economy/micro.html#sec-weiguan-c5' },
        { t: '06 市场失灵', u: 'pages/economy/micro.html#sec-weiguan-c6' },
        { t: '07 微观 vs 宏观', u: 'pages/economy/micro.html#sec-weiguan-c7' },
      ]},
    ]},
  ]},

  { t: '金融学', children: [
    { t: '第一层 · 发生学', links: [
      { t: '01 金融学为什么会诞生', u: 'pages/finance/finance.html#sec-jinrong-c1' },
    ]},
    { t: '第二层 · 结构拆解', links: [
      { t: '02 金融工具体系', u: 'pages/finance/finance.html#sec-jinrong-c4' },
      { t: '03 金融机构体系', u: 'pages/finance/finance.html#sec-jinrong-c2' },
      { t: '04 金融市场体系', u: 'pages/finance/finance.html#sec-jinrong-c3' },
      { t: '05 货币供求与货币乘数', u: 'pages/finance/finance.html#sec-jinrong-c5' },
      { t: '06 货币政策与传导', u: 'pages/finance/finance.html#sec-jinrong-c6' },
      { t: '07 国际金融', u: 'pages/finance/finance.html#sec-jinrong-c7' },
      { t: '08 资产定价机制', u: 'pages/finance/finance.html#sec-jinrong-c8' },
      { t: '09 金融风险类型', u: 'pages/finance/finance.html#sec-jinrong-c9' },
      { t: '10 金融监管体系', u: 'pages/finance/finance.html#sec-jinrong-c10' },
    ]},
    { t: '第三层 · 发生学迭代', links: [
      { t: '11 金融学的四次进化', u: 'pages/finance/finance.html#sec-jinrong-c11' },
    ]},
    { t: '第四层 · 因果传导链', links: [
      { t: '12 三条传导链与终极对比', u: 'pages/finance/finance.html#sec-jinrong-c12' },
    ]},
  ]},

  { t: '管理学', children: [
    { t: '管理概述', links: [
      { t: '01 管理概述', u: 'pages/management/management.html#sec-guanli-c1' },
    ]},
    { t: '思想谱系', links: [
      { t: '02 管理思想谱系', u: 'pages/management/management.html#sec-guanli-c2' },
    ]},
    { t: '五大职能', links: [
      { t: '03 决策', u: 'pages/management/management.html#sec-guanli-c3' },
      { t: '04 计划', u: 'pages/management/management.html#sec-guanli-c4' },
      { t: '05 组织', u: 'pages/management/management.html#sec-guanli-c5' },
      { t: '06 领导', u: 'pages/management/management.html#sec-guanli-c6' },
      { t: '07 控制', u: 'pages/management/management.html#sec-guanli-c7' },
    ]},
  ]},

  { t: '英语', children: [
    { t: '语法结构', u: 'pages/english/grammar.html' },
    { t: '单词每日记', u: 'pages/english/vocabulary.html', disabled: true, n: '待更新' },
  ]},

  { t: '政治理论', children: [
    { t: '党史（历次代表大会）', disabled: true, n: '待更新' },
    { t: '政策文件与重要讲话', disabled: true, n: '待更新' },
    { t: '马克思主义中国化', disabled: true, n: '待更新' },
  ]},

  { t: '行测', children: [
    { t: '言语理解', children: [
      { t: '知识框架', links: [
        { t: '片段阅读', u: 'pages/xingce/verbal.html#sec-1' },
        { t: '语句表达', u: 'pages/xingce/verbal.html#sec-2' },
        { t: '逻辑填空', u: 'pages/xingce/verbal.html#sec-3' },
        { t: '常见干扰项字典', u: 'pages/xingce/verbal.html#sec-4' },
      ]},
      { t: '词语库', u: 'pages/xingce/words.html' },
    ]},
    { t: '判断推理', disabled: true, n: '待更新' },
    { t: '数量关系', disabled: true, n: '待更新' },
    { t: '资料分析', disabled: true, n: '待更新' },
  ]},

  { t: '总结', links: [
    { t: '未来时政联动', u: 'notes.html#sec-future', n: '6' },
  ]},

  { t: '概念深挖', children: [
    { t: '总览', links: [
      { t: '全部概念 · 知识网络', u: 'concepts/overview.html' },
    ]},
    { t: '金融', links: [
      { t: '时间价值', u: 'concepts/finance/time-value.html' },
      { t: '风险厌恶与风险溢价', u: 'concepts/finance/risk-aversion.html' },
      { t: '商业银行', u: 'concepts/finance/commercial-bank.html' },
      { t: '股票', u: 'concepts/finance/stock.html' },
      { t: '市盈率（PE）与PEG', u: 'concepts/finance/pe-peg.html' },
      { t: '市净率（PB）', u: 'concepts/finance/pb.html' },
      { t: 'PE·PB·股息率：三把飞刀', u: 'concepts/finance/pe-pb-dividend.html' },
      { t: '每股收益（EPS）', u: 'concepts/finance/eps.html' },
    ]},
    { t: '管理', links: [
      { t: '人性假设谱系', u: 'concepts/management/human-nature.html' },
      { t: '思想谱系·人物深挖', u: 'concepts/management/masters.html' },
      { t: '决策', u: 'concepts/management/decision.html' },
      { t: '计划工作程序与方法', u: 'concepts/management/planning.html' },
      { t: '组织', u: 'concepts/management/organization.html' },
      { t: '领导', u: 'concepts/management/leadership.html' },
    ]},
  ]},

  { t: '错题本', children: [
    { t: '按考法分类', links: [
      { t: '错题总览', u: 'errors/overview.html' },
    ]},
    { t: '按领域分类', links: [
      { t: '历史人文', u: 'errors/history.html' },
      { t: '法律', u: 'errors/law.html' },
      { t: '经济', u: 'errors/economy.html' },
      { t: '金融', u: 'errors/finance.html' },
      { t: '言语', u: 'errors/verbal.html' },
    ]},
  ]},
];
