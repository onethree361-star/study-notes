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
    { card: '04 计划', u: 'pages/management/management.html#sec-guanli-c4', concepts: [
      { t: '计划工作程序与方法', u: 'concepts/management/planning.html', desc: '八步程序（估目前拟，评选派编）+ 四法（网络图/甘特图/滚动计划/线性规划）+ 四原理（木桶/许诺/灵活/改航道）+ MBO' },
    ]},
    { card: '05 组织', u: 'pages/management/management.html#sec-guanli-c5', concepts: [
      { t: '组织概述', u: 'concepts/management/organization.html', desc: '一词两义（静态实体/动态过程）+ 五特征（目原资活结）+ 设计任务两件套与五原则 + 幅度层次与扁平锥形 + 职权三类型 + 授权四原则 + 六种组织结构类型（直线/职能/直线职能/事业部/矩阵/网络）+ 组织文化三层结构（价值观是核心）+ 人员配备六原理（事适弹标团竞）与内外部选聘优缺 + 组织变革动因三方法与勒温力场分析、解冻变革再冻结' },
    ]},
    { card: '06 领导', u: 'pages/management/management.html#sec-guanli-c6', concepts: [
      { t: '领导', u: 'concepts/management/leadership.html', desc: '领导＝指引引导动员他人实现组织目标；五权两类（法奖强=职位，专感=个人）+ 领导理论三线：风格线（勒温三式·利克特四系统第四最有效）+ 行为线（俄亥俄四分图·管理方格 9-9 团队理想·连续统一体七档）+ 权变线（菲德勒两头任务中间关系·生命周期命说参授）+ 激励三线：内容线（马斯洛五层生安社尊自·ERG 生存关系成长可共存可倒退·双因素不满找保健满意找激励·麦克利兰成就权力归属）+ 过程线（期望=效价×期望值·公平比比值不比绝对量）+ 行为改造线（强化四式 正强·惩罚·负强·忽视）；沟通预留下一层' },
    ]},
  ]},
  { subject: '中国近现代史', icon: '史', groups: [
    { card: '02 中共一大', u: 'pages/history/modern.html#c-jd10', concepts: [
      { t: '中共一大', u: 'concepts/history/yi-da.html', desc: '1921年建党起点：上海法租界石库门开场、嘉兴南湖红船收尾——组织建设从"建党逻辑"起步' },
    ]},
    { card: '03 中共二大', u: 'pages/history/modern.html#c-jd11', concepts: [
      { t: '中共二大', u: 'concepts/history/er-da.html', desc: '1922年上海辅德里：第一次提出反帝反封建民主革命纲领、最高/最低纲领"两步走"、第一部党章、民主联合战线——"建章立制"' },
    ]},
    { card: '04 中共三大', u: 'pages/history/modern.html#c-jd-zd3', concepts: [
      { t: '中共三大', u: 'concepts/history/san-da.html', desc: '1923年广州：确定"党内合作"（共产党员以个人身份加入国民党、保持独立性）——从"要联合"到"怎么联合"' },
    ]},
    { card: '06 中共四大', u: 'pages/history/modern.html#c-jd-zd4', concepts: [
      { t: '中共四大', u: 'concepts/history/si-da.html', desc: '1925年上海：第一次明确提出无产阶级领导权和工农联盟问题——从"保持独立性"转向"争取领导权"' },
    ]},
    { card: '07 南昌起义', u: 'pages/history/modern.html#c-jd12', concepts: [
      { t: '南昌起义', u: 'concepts/history/nanchang-qiyi.html', desc: '1927年8月1日：打响武装反抗国民党反动派第一枪——独立领导革命战争、创建人民军队和武装夺取政权的开始' },
    ]},
    { card: '08 八七会议', u: 'pages/history/modern.html#c-jd13', concepts: [
      { t: '八七会议', u: 'concepts/history/baqi-huiyi.html', desc: '1927年汉口紧急会议：清算陈独秀右倾、"枪杆子里面出政权"——从城市中心转向土地革命与武装反抗' },
    ]},
    { card: '09 秋收起义', u: 'pages/history/modern.html#c-jd14', concepts: [
      { t: '秋收起义', u: 'concepts/history/qiushou-qiyi.html', desc: '1927年湘赣边：第一次打出工农革命军旗号，文家市转兵——中国革命重心转向农村的起点' },
    ]},
    { card: '10 三湾改编', u: 'pages/history/modern.html#c-jd-sw', concepts: [
      { t: '三湾改编', u: 'concepts/history/sanwan-gaibian.html', desc: '1927年永新三湾："支部建在连上"、官兵平等、缩编——新型人民军队的奠基之作' },
    ]},
    { card: '11 中共六大', u: 'pages/history/modern.html#c-jd-zd6', concepts: [
      { t: '中共六大', u: 'concepts/history/liu-da.html', desc: '1928年莫斯科：中国社会是半殖民地半封建、革命性质仍是资产阶级民主革命——唯一一次在国外召开的党代会' },
    ]},
    { card: '12 古田会议', u: 'pages/history/modern.html#c-jd-gt', concepts: [
      { t: '古田会议', u: 'concepts/history/gutian-huiyi.html', desc: '1929年福建上杭：思想建党、政治建军——"党指挥枪"定型于这次会议' },
    ]},
    { card: '14 五次反围剿', u: 'pages/history/modern.html#c-jd-fwj', concepts: [
      { t: '五次反围剿', u: 'concepts/history/fan-weijiao.html', desc: '1930-1934年中央苏区拉锯：前四次胜利靠诱敌深入、第五次败于"御敌于国门之外"——直接导致长征' },
    ]},
    { card: '17 长征', u: 'pages/history/modern.html#c-jd16', concepts: [
      { t: '长征', u: 'concepts/history/changzheng.html', desc: '1934-1936年战略转移：二万五千里、翻雪山过草地、会宁会师——从被迫转移到北上抗日新起点' },
    ]},
    { card: '18 瓦窑堡会议', u: 'pages/history/modern.html#c-jd-wyb', concepts: [
      { t: '瓦窑堡会议', u: 'concepts/history/wayaobao-huiyi.html', desc: '1935年陕北：确立抗日民族统一战线总策略——从"国内阶级战争"转向"民族革命战争"' },
    ]},
    { card: '19 西安事变', u: 'pages/history/modern.html#c-jd-xa', concepts: [
      { t: '西安事变', u: 'concepts/history/xian-shibian.html', desc: '1936年12月12日"双十二事变"：张学良杨虎城兵谏扣蒋、中共力主和平解决——十年内战基本结束、时局转换的枢纽' },
    ]},
    { card: '20 卢沟桥事变', u: 'pages/history/modern.html#c-jd17', concepts: [
      { t: '卢沟桥事变', u: 'concepts/history/lugouqiao-shibian.html', desc: '1937年7月7日"七七事变"：宛平城枪响拉开全面抗战序幕——从局部抗战到全民族抗战' },
    ]},
    { card: '21 洛川会议', u: 'pages/history/modern.html#c-jd-lc', concepts: [
      { t: '洛川会议', u: 'concepts/history/luochuan-huiyi.html', desc: '1937年8月：通过《抗日救国十大纲领》确立全面抗战路线、"独立自主的山地游击战"——定调"怎么打"' },
    ]},
    { card: '24 中共七大', u: 'pages/history/modern.html#c-jd18', concepts: [
      { t: '中共七大', u: 'concepts/history/qi-da.html', desc: '1945年延安：毛泽东思想确立为党的指导思想并写入党章、提出建立联合政府——"团结的大会，胜利的大会"' },
    ]},
    { card: '25 三大战役', u: 'pages/history/modern.html#c-jd-sdz', concepts: [
      { t: '三大战役', u: 'concepts/history/sandazhanyi.html', desc: '1948-1949年辽沈→淮海→平津战略决战：142天歼灭和改编154万——国民党主要军事力量基本被摧毁' },
    ]},
    { card: '26 七届二中全会', u: 'pages/history/modern.html#c-jd-qj2', concepts: [
      { t: '七届二中全会', u: 'concepts/history/qijie-erzhong.html', desc: '1949年西柏坡：工作重心乡村转城市、人民民主专政国体、提出"两个务必"——为新中国成立奠基' },
    ]},
    { card: '27 渡江战役', u: 'pages/history/modern.html#c-jd-dj', concepts: [
      { t: '渡江战役', u: 'concepts/history/dujiang-zhanyi.html', desc: '1949年4月百万雄师过大江：木帆船突破长江天险、4月23日占领南京——国民党22年反动统治覆灭' },
    ]},
    { card: '01 政协会议', u: 'pages/history/modern.html#c-jd-zx', concepts: [
      { t: '政协会议', u: 'concepts/history/zhengxie-huiyi.html', desc: '1949年9月新政协代行全国人大职权：《共同纲领》七章六十条临时宪法+定都北京纪年国旗国歌——完成建国程序' },
    ]},
    { card: '04 全国人民代表大会', u: 'pages/history/modern.html#c-jd-rd', concepts: [
      { t: '全国人民代表大会', u: 'concepts/history/quanguo-renda.html', desc: '1954年一届人大“转正定型”：1953年首次普选近6亿人+“豆选”，五四宪法替代共同纲领——人大制度确立为根本政治制度' },
    ]},
    { card: '05 三大改造', u: 'pages/history/modern.html#c-jd22', concepts: [
      { t: '“一化三改”', u: 'concepts/history/yihua-sangai.html', desc: '1953过渡时期总路线“一体两翼”：一化=社会主义工业化主体，三改=农业、手工业、资本主义工商业两翼——不是“三化一改”' },
    ]},
    { card: '05 三大改造', u: 'pages/history/modern.html#c-jd22', concepts: [
      { t: '三大改造', u: 'concepts/history/san-da-gaizao.html', desc: '1956年底基本完成：农业互助组→初级社→高级社、手工业小组→合作社、工商业加工订货→公私合营（和平赎买付30亿多元定息）——公有制占92.9%' },
    ]},
    { card: '06 社会主义制度的建立', u: 'pages/history/modern.html#c-jd-szzd', concepts: [
      { t: '社会主义制度的建立', u: 'concepts/history/shehui-zhidu.html', desc: '1956年政治制度（1954宪法）+经济制度（三大改造完成、公有制占92.9%）双重汇合——中国进入社会主义社会' },
    ]},
    { card: '07 中共八大', u: 'pages/history/modern.html#c-jd23', concepts: [
      { t: '中共八大', u: 'concepts/history/zhonggong-bada.html', desc: '1956年重新定义主要矛盾（先进工业国 vs 落后农业国）、综合平衡稳步前进、“三个主体三个补充”——探索社会主义建设道路的良好开端' },
    ]},
    { card: '08 大跃进', u: 'pages/history/modern.html#c-jd24', concepts: [
      { t: '大跃进', u: 'concepts/history/da-yuejin.html', desc: '1958总路线+三面红旗：以钢为纲全民大炼钢、以粮为纲浮夸风、人民公社化一大二公——违背八大路线的重大折曲' },
    ]},
    { card: '09 文化大革命', u: 'pages/history/modern.html#c-jd25', concepts: [
      { t: '文化大革命', u: 'concepts/history/wenhua-da-geming.html', desc: '1966-1976十年内乱：1981年《历史决议》定性“不是任何意义上的革命或社会进步”——左倾错误推到极致' },
    ]},
    { card: '10 恢复联合国席位', u: 'pages/history/modern.html#c-jd26', concepts: [
      { t: '恢复联合国席位', u: 'concepts/history/huifu-lianheguo.html', desc: '1971年10月25日联大第2758号决议：恢复权利+承认唯一合法代表+驱逐蒋介石代表——多边法理复位' },
    ]},
    { card: '11 尼克松访华', u: 'pages/history/modern.html#c-jd27', concepts: [
      { t: '尼克松访华', u: 'concepts/history/nikson-fanghua.html', desc: '1972年破冰之旅：《上海公报》“一个中国”框架——中美关系正常化开端，1979年1月1日建交' },
    ]},
    { card: '05 十八届六中全会', u: 'pages/history/modern.html#c-jd-sb6zq', concepts: [
      { t: '四个全面', u: 'concepts/history/si-ge-quanmian.html', desc: '2014年12月首次完整提出的战略布局：全面建成小康社会(后为全面建设社会主义现代化国家)、全面深化改革、全面依法治国、全面从严治党——目标+动力+保障+保证四位一体' },
    ]},
    { card: '06 十九大', u: 'pages/history/modern.html#c-jd40', concepts: [
      { t: '习近平新时代中国特色社会主义思想', u: 'concepts/history/xin-shidai-sixiang.html', desc: '十九大确立写入党章、十九届二中全会载入宪法的根本指导思想：十个明确+两个结合+六个必须坚持，回答"强起来"' },
    ]},
    { card: '09 十九届四中全会', u: 'pages/history/modern.html#c-jd-sj4zq', concepts: [
      { t: '国家治理体系和治理能力现代化', u: 'concepts/history/guojia-zhili.html', desc: '全面深化改革总目标：治理体系(制度)+治理能力(执行)一体两面，十九届四中全会首次专门研究、13个显著优势+三步走' },
    ]},
    { card: '12 二十大', u: 'pages/history/modern.html#c-jd41', concepts: [
      { t: '中国式现代化', u: 'concepts/history/zhongguoshi-xiandaihua.html', desc: '二十大中心任务：人口规模巨大、共同富裕、物质精神协调、人与自然和谐、和平发展五大特征+九条本质要求+五条重大原则' },
    ]},
    { card: '01 十一届三中全会', u: 'pages/history/modern.html#c-jd28', concepts: [
      { t: '十一届三中全会', u: 'concepts/history/shiyijie-sanzhong.html', desc: '1978年12月中央全会：废除"两个凡是"、停止"以阶级斗争为纲"、工作重心转经济建设、作出改革开放决策——伟大转折，中国特色社会主义道路起点' },
    ]},
    { card: '02 农村改革', u: 'pages/history/modern.html#c-jd29', concepts: [
      { t: '农村改革', u: 'concepts/history/nongcun-gaige.html', desc: '家庭联产承包责任制取代人民公社：小岗村18户红手印→五个一号文件→政社分开，粮食6095亿斤→8146亿斤，意外催生乡镇企业' },
    ]},
    { card: '03 经济特区', u: 'pages/history/modern.html#c-jd30', concepts: [
      { t: '经济特区', u: 'concepts/history/jingji-tequ.html', desc: '深圳珠海汕头厦门四特区+海南："杀出一条血路来"的试验田，市场调节为主、外资为主、出口为主' },
    ]},
    { card: '04 中共十二大', u: 'pages/history/modern.html#c-jd31', concepts: [
      { t: '中共十二大', u: 'concepts/history/zhonggong-shier-da.html', desc: '1982年开幕词提出"建设有中国特色的社会主义"+翻两番、小康目标+新党章——"定名"与"立纲"' },
    ]},
    { card: '05 中共十三大', u: 'pages/history/modern.html#c-jd32', concepts: [
      { t: '中共十三大', u: 'concepts/history/zhonggong-shisan-da.html', desc: '1987年系统提出社会主义初级阶段理论、"一个中心两个基本点"基本路线、三步走——为改革开放划定历史坐标' },
    ]},
    { card: '06 南方谈话', u: 'pages/history/modern.html#c-jd33', concepts: [
      { t: '南方谈话', u: 'concepts/history/nanfang-tanhua.html', desc: '1992年三个有利于+计划市场都是手段+社会主义本质+基本路线要管一百年——拆掉"姓社姓资"路障' },
    ]},
    { card: '07 中共十四大', u: 'pages/history/modern.html#c-jd34', concepts: [
      { t: '中共十四大', u: 'concepts/history/zhonggong-shisi-da.html', desc: '1992年确立社会主义市场经济体制为改革目标+邓小平理论写入党章——"破"后的"立"' },
    ]},
    { card: '08 中共十五大', u: 'pages/history/modern.html#c-jd35', concepts: [
      { t: '中共十五大', u: 'concepts/history/zhonggong-shiwu-da.html', desc: '1997年邓小平理论确立为指导思想+依法治国基本方略+基本经济制度与分配制度——铸下制度基石' },
    ]},
    { card: '09 加入WTO', u: 'pages/history/modern.html#c-jd36', concepts: [
      { t: '加入WTO', u: 'concepts/history/jiaru-wto.html', desc: '15年复关入世，2001年12月11日成为第143个成员：清理法规2300多件/19万多件，关税15.3%→9.8%，用外部规则倒逼国内改革' },
    ]},
    { card: '10 中共十六大', u: 'pages/history/modern.html#c-jd37', concepts: [
      { t: '中共十六大', u: 'concepts/history/zhonggong-shiliu-da.html', desc: '2002年"三个代表"写入党章+全面建设小康社会设中间站+胡锦涛当选总书记——定旗定标定人' },
    ]},
    { card: '11 中共十七大', u: 'pages/history/modern.html#c-jd38', concepts: [
      { t: '中共十七大', u: 'concepts/history/zhonggong-shiqi-da.html', desc: '2007年科学发展观写入党章+首提中国特色社会主义理论体系+生态文明首入党代会报告——从"快"到"好"' },
    ]},
  ]},
];
