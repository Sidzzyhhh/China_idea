export const factors = [
  {
    id: 'careerMomentum',
    title: '职业动能',
    tagline: 'STEM / 金融 / 咨询窗口',
    icon: '🛰️',
    description:
      '关注OPT转正率、裁员节奏与岗位增长。结合美国 Tech hiring rebound、国内硬科技补贴、新加坡金融牌照等窗口。',
    defaultValue: 7,
    lowLabel: '可以慢慢来',
    highLabel: '必须立即兑现',
    cues: ['LinkedIn / Levels FYI 新增职位', '国内硬科技基金', '第三地长签支持'],
  },
  {
    id: 'visaCertainty',
    title: '签证与身份稳定',
    tagline: 'H-1B / O-1 / 海外永居',
    icon: '🛂',
    description:
      '衡量抽签概率、身份续期成本以及配偶身份。美国H-1B 中签率下降、国内回流免签、加拿大TR2PR等方案都会影响。',
    defaultValue: 8,
    lowLabel: '风险可控',
    highLabel: '必须锁定身份',
    cues: ['USCIS 抽签率', '中国户籍与落户', '加拿大快速通道'],
  },
  {
    id: 'fundingOutlook',
    title: '科研与资金',
    tagline: 'PhD Funding / Lab Pipeline',
    icon: '🧪',
    description:
      '关注导师经费、实验室裁员、国内高水平科研计划以及欧盟 Horizon 项目。',
    defaultValue: 6,
    lowLabel: '可自筹',
    highLabel: '需要稳定资助',
    cues: ['NSF / NIH 预算', '国内直博岗位', '欧盟 Marie Curie'],
  },
  {
    id: 'financialSafety',
    title: '个人现金流',
    tagline: '生活成本 / 家庭支持',
    icon: '💹',
    description:
      '比较湾区/纽约生活成本、国内一线城市租金、第三地税负与医疗成本。',
    defaultValue: 5,
    lowLabel: '有缓冲',
    highLabel: '必须降本',
    cues: ['Numbeo 生活指数', '国内住房支持', '新加坡 CPF / 税率'],
  },
  {
    id: 'communitySupport',
    title: '支持系统',
    tagline: '社交圈 / 心理健康',
    icon: '🫱🏻‍🫲🏼',
    description:
      '考虑家人距离、同温层社区、心理咨询资源以及文化适配。',
    defaultValue: 4,
    lowLabel: '独自行动',
    highLabel: '需要密集陪伴',
    cues: ['校园心理咨询', '海归社区', '国际生网络'],
  },
  {
    id: 'globalMobility',
    title: '全球机动性',
    tagline: '多国身份 / 职业弹性',
    icon: '🌍',
    description:
      '关注多国工作许可、远程工作的法律框架以及创业签证。',
    defaultValue: 6,
    lowLabel: '本土深耕',
    highLabel: '保持全球跳板',
    cues: ['Digital Nomad Visa', '港澳人才通', '欧盟蓝卡'],
  },
];

export const regressionMatrix = {
  stayUS: {
    careerMomentum: 0.92,
    visaCertainty: 0.48,
    fundingOutlook: 0.68,
    financialSafety: 0.55,
    communitySupport: 0.62,
    globalMobility: 0.74,
  },
  returnCN: {
    careerMomentum: 0.71,
    visaCertainty: 0.95,
    fundingOutlook: 0.82,
    financialSafety: 0.76,
    communitySupport: 0.88,
    globalMobility: 0.63,
  },
  exploreGlobal: {
    careerMomentum: 0.76,
    visaCertainty: 0.63,
    fundingOutlook: 0.74,
    financialSafety: 0.69,
    communitySupport: 0.73,
    globalMobility: 0.91,
  },
};

export const pathMeta = {
  stayUS: {
    label: '留在美国延伸',
    tone: '继续拉升北美履历，解决身份是关键阻力。',
  },
  returnCN: {
    label: '回国加速',
    tone: '依托产业政策与家人网络，落地速度是优势。',
  },
  exploreGlobal: {
    label: '第三地跳板',
    tone: '利用开放移民政策与税收工具，保持流动性。',
  },
};

export function calculateScores(priorities, matrix = regressionMatrix) {
  const totals = {};
  const normalized = {};
  let maxScore = 0;
  let minScore = Number.POSITIVE_INFINITY;

  for (const [path, factorsMap] of Object.entries(matrix)) {
    let weightedSum = 0;
    let weightTotal = 0;
    for (const [factorId, priority] of Object.entries(priorities)) {
      const baseline = factorsMap[factorId] ?? 0;
      weightedSum += priority * baseline;
      weightTotal += priority;
    }
    const meanScore = weightTotal > 0 ? weightedSum / weightTotal : 0;
    totals[path] = meanScore;
    maxScore = Math.max(maxScore, meanScore);
    minScore = Math.min(minScore, meanScore);
  }

  if (!Number.isFinite(minScore)) minScore = 0;
  if (!Number.isFinite(maxScore) || maxScore === minScore) {
    for (const path of Object.keys(totals)) {
      normalized[path] = Math.round(totals[path] * 100);
    }
    return { raw: totals, normalized };
  }

  for (const [path, value] of Object.entries(totals)) {
    const scaled = (value - minScore) / (maxScore - minScore);
    normalized[path] = Math.round(scaled * 100);
  }

  return { raw: totals, normalized };
}

export function rankPaths(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([path]) => path);
}

export function buildCallouts({ raw, normalized }, priorities) {
  const ranking = rankPaths(normalized);
  const topPath = ranking[0];
  const runnerUp = ranking[1];
  const delta = Math.abs(normalized[topPath] - normalized[runnerUp ?? topPath]);
  const focusFactor = Object.entries(priorities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([factorId]) => factorId);

  const callouts = [];
  if (delta <= 8) {
    callouts.push({
      title: '差距极小',
      body: '两个备选路径接近打平。建议进一步核实薪资、签证时间线等硬数据。',
    });
  } else if (delta >= 25) {
    callouts.push({
      title: '领先清晰',
      body: `${pathMeta[topPath].label} 显著领先，可集中资源冲刺，同时预留 Plan B。`,
    });
  } else {
    callouts.push({
      title: '保持动态追踪',
      body: `${pathMeta[topPath].label} 略占优势，关注半年内的政策/资金波动。`,
    });
  }

  for (const factorId of focusFactor) {
    const factor = factors.find((item) => item.id === factorId);
    if (!factor) continue;
    callouts.push({
      title: `${factor.title} 是核心变量`,
      body: `${factor.description.split('。')[0]}。优先把这项的数据做得更透明。`,
    });
  }

  return callouts;
}

export function generateInsights({ normalized }, priorities) {
  const ranking = rankPaths(normalized);
  const insights = [];
  const topPath = ranking[0];
  const bottomPath = ranking[ranking.length - 1];

  insights.push({
    term: '当前最优路径',
    detail: `${pathMeta[topPath].label} · ${pathMeta[topPath].tone}`,
  });

  insights.push({
    term: '最弱路径',
    detail: `${pathMeta[bottomPath].label} 分值偏低，可结合权重检查是否低估了它的资源。`,
  });

  const highestPriority = Object.entries(priorities).sort((a, b) => b[1] - a[1])[0];
  if (highestPriority) {
    const factor = factors.find((item) => item.id === highestPriority[0]);
    insights.push({
      term: '最高权重',
      detail: `${factor.title}：${factor.tagline}`,
    });
  }

  return insights;
}

export function normalizeSliderValue(value, min = 0, max = 10) {
  const clamped = Math.min(Math.max(value, min), max);
  return clamped / (max - min || 1);
}
