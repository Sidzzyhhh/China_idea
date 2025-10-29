const DESTINATIONS = ["us", "cn", "third"];
const DEST_LABELS = {
  us: "留在美国",
  cn: "回到中国",
  third: "探索第三地"
};

export const QUESTIONS = [
  {
    id: "career",
    title: "你想在哪种舞台发力?",
    prompt: "选一个最贴近现在心情的选项。",
    helper: "想像你下一个18个月的状态，别纠结完美答案。",
    options: [
      { value: "bigtech", label: "成熟大厂，资源齐备" },
      { value: "startup", label: "小团队，动作快" },
      { value: "academic", label: "学术/实验室，继续钻研" },
      { value: "skip", label: "不了解/跳过", isSkip: true }
    ]
  },
  {
    id: "visa",
    title: "你最在意的身份路径?",
    prompt: "签证和居留的哪个环节让你最上心?",
    helper: "可以带着一点焦虑选项，这本来就是需要面对的。",
    options: [
      { value: "h1b", label: "H-1B 抽签或赞助" },
      { value: "opt", label: "OPT/STEM OPT 延长" },
      { value: "permanent", label: "长期绿卡或永居" },
      { value: "skip", label: "不了解/跳过", isSkip: true }
    ]
  },
  {
    id: "finance",
    title: "财务底气更靠什么?",
    prompt: "哪种支撑让你敢走这一步?",
    helper: "钱够不够，是节奏问题，不是羞于开口的话题。",
    options: [
      { value: "salary", label: "高薪和奖金" },
      { value: "cost", label: "低生活成本" },
      { value: "family", label: "家庭支持/储蓄" },
      { value: "skip", label: "不了解/跳过", isSkip: true }
    ]
  },
  {
    id: "life",
    title: "生活节奏你想要哪种?",
    prompt: "想到居住城市时，脑中浮现什么画面?",
    helper: "越具体越好，通勤、氛围、社群都算。",
    options: [
      { value: "fast", label: "高速节奏，机会密集" },
      { value: "city", label: "国际都市，文化混合" },
      { value: "community", label: "紧密社区，有熟面孔" },
      { value: "skip", label: "不了解/跳过", isSkip: true }
    ]
  },
  {
    id: "academic",
    title: "学术规划在你心里排第几?",
    prompt: "接下来三年，你还想深挖研究吗?",
    helper: "就算答不确定，也是一种答案。",
    options: [
      { value: "deep", label: "继续做研究/读博" },
      { value: "mentor", label: "想要强导师和平台" },
      { value: "pause", label: "暂时搁置学术" },
      { value: "skip", label: "不了解/跳过", isSkip: true }
    ]
  },
  {
    id: "support",
    title: "谁在你身边撑你?",
    prompt: "现实里，哪个支持网络最牢靠?",
    helper: "别想标准答案，只想你信任的人。",
    options: [
      { value: "family", label: "父母或亲人" },
      { value: "partner", label: "伴侣或密友" },
      { value: "alumni", label: "校友/同行社群" },
      { value: "skip", label: "不了解/跳过", isSkip: true }
    ]
  },
  {
    id: "identity",
    title: "未来五到十年，你更像哪里的人?",
    prompt: "此刻直觉最重要。",
    helper: "认同感没有标准答案，今天的感觉就好。",
    options: [
      { value: "us", label: "更像美国人" },
      { value: "cn", label: "更像中国人" },
      { value: "third", label: "想做世界公民" },
      { value: "skip", label: "不了解/跳过", isSkip: true }
    ]
  }
];

export const FEATURE_KEYS = [
  "career_bigtech",
  "career_startup",
  "career_academic",
  "career_skip",
  "visa_h1b",
  "visa_opt",
  "visa_permanent",
  "visa_skip",
  "finance_salary",
  "finance_cost",
  "finance_family",
  "finance_skip",
  "life_fast",
  "life_city",
  "life_community",
  "life_skip",
  "academic_deep",
  "academic_mentor",
  "academic_pause",
  "academic_skip",
  "support_family",
  "support_partner",
  "support_alumni",
  "support_skip",
  "identity_us",
  "identity_cn",
  "identity_third",
  "identity_skip"
];

const FEATURE_INDEX = FEATURE_KEYS.reduce((acc, key, idx) => {
  acc[key] = idx;
  return acc;
}, {});

const FEATURE_RULES = {
  career: {
    bigtech: { career_bigtech: 1, identity_us: 0.2 },
    startup: { career_startup: 1, identity_third: 0.2 },
    academic: { career_academic: 1, academic_deep: 0.3 },
    skip: { career_skip: 1 }
  },
  visa: {
    h1b: { visa_h1b: 1, identity_us: 0.2 },
    opt: { visa_opt: 1, career_startup: 0.2 },
    permanent: { visa_permanent: 1, identity_third: 0.2 },
    skip: { visa_skip: 1 }
  },
  finance: {
    salary: { finance_salary: 1, life_fast: 0.2 },
    cost: { finance_cost: 1, life_community: 0.2 },
    family: { finance_family: 1, support_family: 0.3 },
    skip: { finance_skip: 1 }
  },
  life: {
    fast: { life_fast: 1 },
    city: { life_city: 1, identity_us: 0.2 },
    community: { life_community: 1, identity_third: 0.2 },
    skip: { life_skip: 1 }
  },
  academic: {
    deep: { academic_deep: 1 },
    mentor: { academic_mentor: 1, career_bigtech: 0.2 },
    pause: { academic_pause: 1 },
    skip: { academic_skip: 1 }
  },
  support: {
    family: { support_family: 1, finance_family: 0.2 },
    partner: { support_partner: 1 },
    alumni: { support_alumni: 1, career_startup: 0.2 },
    skip: { support_skip: 1 }
  },
  identity: {
    us: { identity_us: 1 },
    cn: { identity_cn: 1 },
    third: { identity_third: 1 },
    skip: { identity_skip: 1 }
  }
};

const FEATURE_REASONS = {
  career_bigtech: "你看重成熟平台",
  career_startup: "你想要灵活和速度",
  career_academic: "你对学术舞台上心",
  visa_h1b: "身份风险在你心上",
  visa_opt: "你想多争取过渡时间",
  visa_permanent: "你盼着长期稳住身份",
  finance_salary: "你需要薪水拉满",
  finance_cost: "你希望成本可控",
  finance_family: "家人的支持让你踏实",
  life_fast: "你能接受快节奏",
  life_city: "你向往国际都市",
  life_community: "你更想要熟悉社区",
  academic_deep: "你还想继续深挖研究",
  academic_mentor: "你需要导师资源",
  academic_pause: "你想先跳出学术",
  support_family: "家人支撑很关键",
  support_partner: "伴侣的节奏影响你",
  support_alumni: "同侪网络给你能量",
  identity_us: "你更像在美国扎根",
  identity_cn: "你心底牵着中国",
  identity_third: "你想做全球游牧",
  identity_skip: "你还在寻找新的认同"
};

const WEIGHT_MATRIX = {
  us: new Float32Array([
    1.1, 0.2, 0.4, 0, // career
    1.3, 0.6, 0.3, 0, // visa
    1.0, 0.3, 0.2, 0, // finance
    0.8, 0.5, 0.3, 0, // life
    0.6, 0.7, 0.1, 0, // academic
    0.5, 0.4, 0.6, 0, // support
    1.4, 0.3, 0.2, 0 // identity
  ]),
  cn: new Float32Array([
    0.7, 0.5, 0.4, 0.1,
    0.4, 0.2, 0.5, 0.1,
    0.5, 0.6, 1.1, 0.2,
    0.5, 0.6, 0.5, 0.1,
    0.4, 0.5, 0.3, 0.1,
    1.2, 0.8, 0.4, 0.2,
    0.5, 1.4, 0.3, 0.2
  ]),
  third: new Float32Array([
    0.5, 1.3, 0.8, 0.2,
    0.3, 0.9, 1.4, 0.3,
    0.4, 1.1, 0.5, 0.2,
    0.6, 0.9, 1.3, 0.3,
    0.6, 0.4, 0.7, 0.2,
    0.6, 0.7, 0.9, 0.3,
    0.3, 0.4, 1.5, 0.3
  ])
};

const BIAS = {
  us: 0.2,
  cn: 0.1,
  third: 0.1
};

const STORAGE_KEY = "nori-flow-v2";

export function toFeatures(answerMap = {}) {
  const vector = new Float32Array(FEATURE_KEYS.length);
  for (const question of QUESTIONS) {
    const chosen = answerMap[question.id];
    const useValue = chosen ?? "skip";
    const mapping = FEATURE_RULES[question.id][useValue];
    if (!mapping) continue;
    for (const [featureKey, value] of Object.entries(mapping)) {
      const idx = FEATURE_INDEX[featureKey];
      if (idx === undefined) continue;
      vector[idx] += value;
    }
  }
  return vector;
}

function dot(weights, vector) {
  let sum = 0;
  for (let i = 0; i < vector.length; i += 1) {
    sum += weights[i] * vector[i];
  }
  return sum;
}

export function scoreEngine(answerMap = {}) {
  const features = toFeatures(answerMap);
  const raw = {};
  let maxRaw = -Infinity;
  for (const dest of DESTINATIONS) {
    const total = dot(WEIGHT_MATRIX[dest], features) + BIAS[dest];
    raw[dest] = total;
    if (total > maxRaw) maxRaw = total;
  }
  const exp = {};
  let sum = 0;
  for (const dest of DESTINATIONS) {
    const value = Math.exp(raw[dest] - maxRaw);
    exp[dest] = value;
    sum += value;
  }
  const totals = {};
  for (const dest of DESTINATIONS) {
    totals[dest] = Math.round((exp[dest] / sum) * 1000) / 10;
  }
  const ranking = DESTINATIONS.slice().sort((a, b) => totals[b] - totals[a]);
  const top = ranking[0];
  const reasons = buildRationale(top, features);
  return { totals, ranking, rationale: reasons, features };
}

function buildRationale(destination, features) {
  const weights = WEIGHT_MATRIX[destination];
  const contributions = [];
  for (let i = 0; i < features.length; i += 1) {
    const value = features[i] * weights[i];
    if (value <= 0) continue;
    const key = FEATURE_KEYS[i];
    if (!FEATURE_REASONS[key]) continue;
    contributions.push({ key, value });
  }
  contributions.sort((a, b) => b.value - a.value);
  const topReasons = contributions.slice(0, 2).map((item) => FEATURE_REASONS[item.key]);
  if (topReasons.length) {
    return `你${topReasons.join("，")}，${DEST_LABELS[destination]}更合适。`;
  }
  return `目前答案比较平均，小诺建议你回头再看一遍问题。`;
}

export function serializeAnswers(answerMap = {}) {
  const payload = QUESTIONS.map((q) => answerMap[q.id] ?? "skip");
  return payload.map((entry) => encodeURIComponent(entry)).join(".");
}

export function parseAnswers(serial = "") {
  if (!serial) return {};
  const cleaned = serial.trim();
  if (!cleaned) return {};
  const parts = cleaned.split(".").map((chunk) => decodeURIComponent(chunk));
  const restored = {};
  parts.forEach((value, index) => {
    const question = QUESTIONS[index];
    if (!question) return;
    if (value && value !== "skip") {
      restored[question.id] = value;
    } else {
      restored[question.id] = "skip";
    }
  });
  return restored;
}

function loadState() {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const answers = parsed.answers ?? {};
    const index = Number.isInteger(parsed.index) ? parsed.index : 0;
    return { answers, index };
  } catch (error) {
    console.warn("无法解析本地存储", error);
    return null;
  }
}

function saveState(state) {
  if (typeof localStorage === "undefined") return;
  const payload = JSON.stringify({ answers: state.answers, index: state.index });
  localStorage.setItem(STORAGE_KEY, payload);
}

function clearState() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

function setupYear() {
  const span = document.querySelector("[data-year]");
  if (span) {
    span.textContent = new Date().getFullYear();
  }
}

async function injectMascots() {
  if (typeof document === "undefined") return;
  const shells = Array.from(document.querySelectorAll("[data-mascot]"));
  if (!shells.length) return;
  try {
    const response = await fetch("brand/mascot.svg");
    const text = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(text, "image/svg+xml");
    const template = svgDoc.documentElement;
    shells.forEach((shell) => {
      const clone = template.cloneNode(true);
      clone.classList.add('mascot');
      clone.setAttribute("data-state", shell.getAttribute("data-state") || "curious");
      clone.setAttribute("aria-hidden", "true");
      shell.replaceWith(clone);
    });
  } catch (error) {
    console.warn("吉祥物加载失败", error);
  }
}

function initIndex() {
  const chips = document.querySelectorAll(".chip[data-suggest]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const target = chip.getAttribute("data-suggest");
      window.location.href = `quiz.html?suggest=${encodeURIComponent(target)}#start`;
    });
  });
}

function initLearn() {
  // Mascot injection already handled globally
}

function initQuiz() {
  const quizRoot = document.querySelector("[data-quiz]");
  if (!quizRoot) return;
  const intro = quizRoot.querySelector("[data-intro]");
  const flow = quizRoot.querySelector("[data-flow]");
  const result = quizRoot.querySelector("[data-result]");
  const questionSlot = quizRoot.querySelector("[data-question]");
  const helper = quizRoot.querySelector("[data-helper]");
  const helperToggle = helper.querySelector(".helper-toggle");
  const helperBody = helper.querySelector(".helper-body");
  const progressBar = flow.querySelector(".progress-bar");
  const progressCount = flow.querySelector("[data-progress-count]");
  const suggestion = flow.querySelector(".suggestion");
  const shareStatus = result.querySelector('[data-share-status]');

  const params = new URLSearchParams(window.location.search);
  const suggest = params.get("suggest");
  if (suggest && DEST_LABELS[suggest]) {
    suggestion.hidden = false;
    suggestion.textContent = `建议优先探索：${DEST_LABELS[suggest]}`;
  }

  let state = loadState() || { answers: {}, index: 0 };

  const shareParam = params.get("a");
  const fromShare = shareParam ? parseAnswers(shareParam) : null;
  if (fromShare) {
    state = { answers: fromShare, index: QUESTIONS.length };
    saveState(state);
    intro.hidden = true;
    flow.hidden = true;
    result.hidden = false;
    renderResult(result, state.answers);
    requestAnimationFrame(() => {
      if (!window.location.hash.includes("result")) {
        window.location.hash = "result";
      }
    });
    return;
  }

  const startButton = quizRoot.querySelector('[data-action="begin"]');
  startButton?.addEventListener("click", () => {
    startFlow();
  });

  helperToggle.addEventListener("click", () => {
    const expanded = helperToggle.getAttribute("aria-expanded") === "true";
    helperToggle.setAttribute("aria-expanded", String(!expanded));
    helperBody.hidden = expanded;
  });

  quizRoot.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.getAttribute("data-action");
    if (!action) return;
    event.preventDefault();
    if (action === "restart") {
      clearState();
      state = { answers: {}, index: 0 };
      intro.hidden = false;
      flow.hidden = true;
      result.hidden = true;
      suggestion.hidden = !suggest;
      helperBody.hidden = true;
      helperToggle.setAttribute("aria-expanded", "false");
      if (shareStatus) {
        shareStatus.hidden = true;
        shareStatus.textContent = "";
      }
      if (window.location.hash !== "") window.location.hash = "";
    }
    if (action === "begin") {
      startFlow();
    }
    if (action === "share") {
      shareResult(state.answers);
    }
    if (action === "print") {
      window.print();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (flow.hidden) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(state.index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(state.index - 1);
    }
  });

  const startHash = window.location.hash;
  if (startHash === "#start" || state.index > 0 || Object.keys(state.answers).length) {
    startFlow();
  }

  function startFlow() {
    intro.hidden = true;
    flow.hidden = false;
    result.hidden = true;
    const pendingIndex = QUESTIONS.findIndex((q) => state.answers[q.id] === undefined);
    const target = pendingIndex === -1 ? Math.min(state.index, QUESTIONS.length - 1) : pendingIndex;
    goTo(target);
    updateProgress();
  }

  function goTo(index) {
    const bounded = Math.max(0, Math.min(index, QUESTIONS.length - 1));
    state.index = bounded;
    saveState(state);
    renderQuestion(questionSlot, bounded, state.answers);
    updateProgress();
    helperBody.hidden = true;
    helperToggle.setAttribute("aria-expanded", "false");
    helperBody.querySelector("p").textContent = QUESTIONS[bounded].helper;
  }

  function updateProgress() {
    const answered = QUESTIONS.filter((q) => state.answers[q.id] !== undefined).length;
    const percent = Math.round((answered / QUESTIONS.length) * 100);
    progressBar.style.width = `${percent}%`;
    progressCount.textContent = String(percent);
  }

  function selectAnswer(questionId, value) {
    state.answers[questionId] = value;
    saveState(state);
    const currentIndex = QUESTIONS.findIndex((q) => q.id === questionId);
    const answered = QUESTIONS.filter((q) => state.answers[q.id] !== undefined).length;
    if (answered === QUESTIONS.length) {
      renderResult(result, state.answers);
      flow.hidden = true;
      result.hidden = false;
      window.location.hash = "result";
      return;
    }
    const nextIndex = Math.min(currentIndex + 1, QUESTIONS.length - 1);
    goTo(nextIndex);
  }

  function renderQuestion(container, index, answers) {
    const question = QUESTIONS[index];
    container.innerHTML = "";
    const title = document.createElement("h2");
    title.textContent = question.title;
    const prompt = document.createElement("p");
    prompt.className = "subtitle";
    prompt.textContent = question.prompt;
    const meta = document.createElement("div");
    meta.className = "question-meta";
    const counter = document.createElement("span");
    counter.textContent = `第 ${index + 1} 题 · 共 ${QUESTIONS.length} 题`;
    const controls = document.createElement("div");
    controls.className = "question-controls";
    if (index > 0) {
      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "inline-action";
      prev.textContent = "上一题";
      prev.addEventListener("click", () => goTo(index - 1));
      controls.appendChild(prev);
    }
    if (index < QUESTIONS.length - 1) {
      const skipInfo = document.createElement("span");
      skipInfo.textContent = "不确定就点“不了解/跳过”";
      controls.appendChild(skipInfo);
    }
    meta.append(counter, controls);
    const options = document.createElement("div");
    options.className = "option-list";

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.textContent = option.label;
      const selected = answers[question.id] === option.value;
      if (selected) {
        button.setAttribute("data-selected", "true");
      }
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.addEventListener("click", () => {
        selectAnswer(question.id, option.value);
      });
      options.appendChild(button);
    });

    container.append(title, prompt, meta, options);
  }

  function renderResult(section, answers) {
    const { totals, ranking, rationale } = scoreEngine(answers);
    section.querySelector("[data-top-destination]").textContent = DEST_LABELS[ranking[0]];
    const list = section.querySelector(".result-bars");
    list.innerHTML = "";
    const status = section.querySelector('[data-share-status]');
    if (status) status.hidden = true;
    ranking.forEach((dest) => {
      const row = document.createElement("div");
      row.className = "result-row";
      const name = document.createElement("span");
      name.textContent = DEST_LABELS[dest];
      const meter = document.createElement("div");
      meter.className = "result-meter";
      const bar = document.createElement("div");
      bar.style.width = `${totals[dest]}%`;
      meter.appendChild(bar);
      const value = document.createElement("span");
      value.textContent = `${totals[dest]}%`;
      row.append(name, meter, value);
      list.appendChild(row);
    });
    section.querySelector("[data-rationale]").textContent = rationale;
  }

  function shareResult(answers) {
    const serial = serializeAnswers(answers);
    const base = `${window.location.origin}${window.location.pathname.replace(/[^/]+$/, "")}`;
    const url = `${base}quiz.html?a=${serial}#result`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        if (shareStatus) {
          shareStatus.hidden = false;
          shareStatus.textContent = "链接已复制，分享给需要的人。";
        }
      }).catch(() => {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    if (shareStatus) {
      shareStatus.hidden = false;
      shareStatus.textContent = "链接已复制，分享给需要的人。";
    }
  }
}

function boot() {
  setupYear();
  injectMascots();
  const page = document.body?.dataset?.page;
  if (page === "index") initIndex();
  if (page === "quiz") initQuiz();
  if (page === "learn") initLearn();
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", boot);
}

export default {
  QUESTIONS,
  FEATURE_KEYS,
  toFeatures,
  scoreEngine,
  serializeAnswers,
  parseAnswers
};
