/* ===== 概念深挖总览数据源（唯一事实来源） =====
 * 规则（AI 添加概念时必须同步维护本文件）：
 * 1. subject = 学科组；groups = 学科下的知识点（对应板块页知识卡片，u=跳正文锚点）；
 *    concepts = 挂在知识点下的概念（t=概念名，u=详情页路径，desc=一句话定义）。
 * 2. 新增概念四步：① 本文件对应组 concepts 里加 {t,u,desc}
 *                  ② 建 concepts/【域】/【概念英文名】.html 详情页（复制 _template.html）
 *                  ③ js/nav.js「概念深挖」对应域加链接
 *                  ④ search-index.json 加详情页条目
 * 3. 概念掌握度独立存储于 localStorage「mastery.v2:concepts-overview」
 *    （{"概念详情页路径":"blur"|"ok"}），与详情页内卡片状态互不影响。
 * 4. icon = 学科组头单字图标；为空时自动取 subject 首字。
 */
const CONCEPTS_DATA = [
  { subject: '金融学', icon: '融', groups: [
    { card: '02 金融机构体系', u: 'pages/finance/finance.html#sec-jinrong-c2', concepts: [
      { t: '商业银行', u: 'concepts/finance/commercial-bank.html', desc: '经营钱与风险的资金中介：负债、资产、表外三驾马车' },
    ]},
    { card: '04 金融工具体系', u: 'pages/finance/finance.html#sec-jinrong-c4', concepts: [
      { t: '股票', u: 'concepts/finance/stock.html', desc: '股权凭证：一级市场发行，二级市场定价' },
    ]},
  ]},
];
