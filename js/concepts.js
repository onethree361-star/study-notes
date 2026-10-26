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
 * 5. group 的 card 编号 = 板块页卡片显示序号（锚点 id 与序号解耦，如
 *    sec-jinrong-c4 的显示序号是 02——卡片重排后 id 保持历史锚点不变）。
 */
const CONCEPTS_DATA = [
  { subject: '金融学', icon: '融', groups: [
    { card: '01 金融学为什么会诞生', u: 'pages/finance/finance.html#sec-jinrong-c1', concepts: [
      { t: '时间价值', u: 'concepts/finance/time-value.html', desc: '今天的100块比明天的100块值钱：通胀+机会成本 → 利息与折现' },
      { t: '风险厌恶与风险溢价', u: 'concepts/finance/risk-aversion.html', desc: '怕亏本是天性：担险必须有溢价补偿，高收益必然伴随高风险' },
    ]},
    { card: '02 金融工具体系', u: 'pages/finance/finance.html#sec-jinrong-c4', concepts: [
      { t: '股票', u: 'concepts/finance/stock.html', desc: '股权凭证：一级市场发行，二级市场定价' },
      { t: '市盈率（PE）与PEG', u: 'concepts/finance/pe-peg.html', desc: 'PE是回本年限；PEG用成长性给估值打折，小于1是真香' },
      { t: '市净率（PB）', u: 'concepts/finance/pb.html', desc: 'PB看家底：股价÷每股净资产，破净不一定底，ROE高才是真香' },
      { t: 'PE·PB·股息率：三把飞刀', u: 'concepts/finance/pe-pb-dividend.html', desc: 'PB=PE×ROE，股息率=分红率÷PE；三种画像：黑马、贵族、奶牛' },
      { t: '每股收益（EPS）', u: 'concepts/finance/eps.html', desc: '客观实力：公司每1股一年赚多少钱；PE是主观预期，股价=EPS×PE' },
    ]},
    { card: '03 金融机构体系', u: 'pages/finance/finance.html#sec-jinrong-c2', concepts: [
      { t: '商业银行', u: 'concepts/finance/commercial-bank.html', desc: '经营钱与风险的资金中介：负债、资产、表外三驾马车' },
    ]},
  ]},
  { subject: '管理学', icon: '管', groups: [
    { card: '02 管理思想谱系', u: 'pages/management/management.html#sec-guanli-c2', concepts: [
      { t: '人性假设谱系', u: 'concepts/management/human-nature.html', desc: '经济人→社会人→自我实现人→复杂人→知识人：人性判断一变，整套管理手段跟着换' },
      { t: '思想谱系·人物深挖', u: 'concepts/management/masters.html', desc: '每个理论背后都有一个现场：制针厂、秒表、霍桑灯泡——人物故事与学说因果' },
    ]},
    { card: '03 决策', u: 'pages/management/management.html#sec-guanli-c3', concepts: [
      { t: '决策', u: 'concepts/management/decision.html', desc: '有限理性求满意解：六步过程 + 两种分类 + 一整箱工具（盈亏平衡/决策树/SWOT/波士顿/脑名德电）' },
    ]},
  ]},
];
