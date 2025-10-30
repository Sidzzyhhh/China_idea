(function (global) {
  const ROUTES = ["US", "CN", "THIRD"];
  const ROUTE_LABELS = {
    US: "留在美国",
    CN: "回到中国",
    THIRD: "探索第三地"
  };
  const STORAGE_KEY = "nori-answers";

  const QUESTIONS = [
    {
      id: "career",
      title: "职业舞台你更向往？",
      note: "第一反应通常最真诚。",
      featurePrefix: "career",
      options: [
        {
          id: "career_bigtech",
          label: "大厂",
          description: "成熟体系，资源齐全",
          weights: { US: 1.2, CN: 0.7, THIRD: 0.4 },
          reasons: {
            US: "你想要大厂舞台",
            CN: "你也关注国内头部公司"
          }
        },
        {
          id: "career_startup",
          label: "初创",
          description: "要速度也要试错",
          weights: { US: 0.6, CN: 0.8, THIRD: 1.0 },
          reasons: {
            THIRD: "你想靠近更灵活的生态",
            CN: "你感兴趣国内创业潮"
          }
        },
        {
          id: "career_academic",
          label: "学术",
          description: "研究和教学优先",
          weights: { US: 0.9, CN: 0.9, THIRD: 0.7 },
          reasons: {
            US: "你重视科研舞台",
            CN: "你留意国内高校机会"
          }
        },
        {
          id: "career_unsure",
          label: "还不确定",
          description: "先观察",
          weights: { US: 0.5, CN: 0.5, THIRD: 0.5 }
        }
      ]
    },
    {
      id: "status",
      title: "身份路径你更看重哪一条？",
      note: "第一反应通常最真诚。",
      featurePrefix: "status",
      options: [
        {
          id: "status_h1b",
          label: "H-1B 下注",
          description: "愿意冲抽签",
          weights: { US: 1.3, CN: 0.4, THIRD: 0.5 },
          reasons: {
            US: "你愿意押注美国身份"
          }
        },
        {
          id: "status_opt",
          label: "OPT 或 STEM OPT",
          description: "想把工签用满",
          weights: { US: 1.1, CN: 0.5, THIRD: 0.7 },
          reasons: {
            US: "你想延长美国实战",
            THIRD: "你在寻找备选身份"
          }
        },
        {
          id: "status_green",
          label: "长期绿卡路径",
          description: "希望稳住身份",
          weights: { US: 1.0, CN: 1.0, THIRD: 0.8 },
          reasons: {
            CN: "你看中国内的确定性",
            THIRD: "你愿意找第三地的稳定"
          }
        },
        {
          id: "status_unsure",
          label: "不确定",
          description: "继续搜集情报",
          weights: { US: 0.6, CN: 0.6, THIRD: 0.6 }
        }
      ]
    },
    {
      id: "finance",
      title: "收入与成本的优先级？",
      note: "第一反应通常最真诚。",
      featurePrefix: "finance",
      options: [
        {
          id: "finance_salary",
          label: "薪资最大化",
          description: "想要更高现金",
          weights: { US: 1.2, CN: 0.7, THIRD: 0.8 },
          reasons: {
            US: "你盯着高薪市场",
            THIRD: "你想找薪资稳定的第三地"
          }
        },
        {
          id: "finance_cost",
          label: "生活成本",
          description: "先考虑支出",
          weights: { US: 0.6, CN: 1.1, THIRD: 1.0 },
          reasons: {
            CN: "你看重成本控制",
            THIRD: "你想追求花费更稳的地方"
          }
        },
        {
          id: "finance_family",
          label: "家庭支持",
          description: "资源来自家人",
          weights: { US: 0.8, CN: 1.0, THIRD: 0.7 },
          reasons: {
            CN: "你想靠近家庭后盾"
          }
        },
        {
          id: "finance_unsure",
          label: "还在权衡",
          description: "暂时没答案",
          weights: { US: 0.6, CN: 0.6, THIRD: 0.6 }
        }
      ]
    },
    {
      id: "lifestyle",
      title: "生活方式的关键要素？",
      note: "第一反应通常最真诚。",
      featurePrefix: "lifestyle",
      options: [
        {
          id: "lifestyle_city",
          label: "城市节奏",
          description: "喜欢快节奏",
          weights: { US: 1.1, CN: 0.9, THIRD: 0.8 },
          reasons: {
            US: "你享受快节奏都市",
            CN: "你也适应国内大城市"
          }
        },
        {
          id: "lifestyle_community",
          label: "社区归属",
          description: "要熟悉的圈子",
          weights: { US: 0.8, CN: 1.1, THIRD: 0.8 },
          reasons: {
            CN: "你想和熟悉的人在一起"
          }
        },
        {
          id: "lifestyle_climate",
          label: "气候偏好",
          description: "想换种环境",
          weights: { US: 0.7, CN: 0.8, THIRD: 1.1 },
          reasons: {
            THIRD: "你想换个生活节奏"
          }
        },
        {
          id: "lifestyle_unsure",
          label: "还不确定",
          description: "先保持弹性",
          weights: { US: 0.6, CN: 0.6, THIRD: 0.6 }
        }
      ]
    },
    {
      id: "academic",
      title: "学术路线的优先级？",
      note: "第一反应通常最真诚。",
      featurePrefix: "academic",
      options: [
        {
          id: "academic_phd",
          label: "继续读博/博后",
          description: "科研是主线",
          weights: { US: 1.0, CN: 0.9, THIRD: 0.7 },
          reasons: {
            US: "你想留在科研圈",
            CN: "你也看国内的实验室"
          }
        },
        {
          id: "academic_mentor",
          label: "导师资源",
          description: "跟着导师走",
          weights: { US: 0.9, CN: 1.1, THIRD: 0.8 },
          reasons: {
            CN: "你想延续导师的人脉"
          }
        },
        {
          id: "academic_shift",
          label: "考虑转业",
          description: "开放非学术",
          weights: { US: 0.9, CN: 0.9, THIRD: 1.0 },
          reasons: {
            THIRD: "你愿意把研究成果带去新市场"
          }
        },
        {
          id: "academic_unsure",
          label: "还没定",
          description: "随缘",
          weights: { US: 0.6, CN: 0.6, THIRD: 0.6 }
        }
      ]
    },
    {
      id: "support",
      title: "支持网络在哪？",
      note: "第一反应通常最真诚。",
      featurePrefix: "support",
      options: [
        {
          id: "support_family",
          label: "亲友在国内",
          description: "后援在那边",
          weights: { US: 0.6, CN: 1.3, THIRD: 0.7 },
          reasons: {
            CN: "你想靠近亲友"
          }
        },
        {
          id: "support_partner",
          label: "伴侣/校友在美国",
          description: "想保持距离近",
          weights: { US: 1.2, CN: 0.6, THIRD: 0.7 },
          reasons: {
            US: "你想和重要的人留在美国"
          }
        },
        {
          id: "support_network",
          label: "圈子在第三地",
          description: "看向国际社群",
          weights: { US: 0.7, CN: 0.7, THIRD: 1.2 },
          reasons: {
            THIRD: "你已经在第三地有网络"
          }
        },
        {
          id: "support_unsure",
          label: "分散在各地",
          description: "需要再确认",
          weights: { US: 0.6, CN: 0.6, THIRD: 0.6 }
        }
      ]
    },
    {
      id: "identity",
      title: "长期认同更倾向哪里？",
      note: "第一反应通常最真诚。",
      featurePrefix: "identity",
      options: [
        {
          id: "identity_us",
          label: "把自己当在美发展",
          description: "长线在此",
          weights: { US: 1.3, CN: 0.5, THIRD: 0.6 },
          reasons: {
            US: "你把长线放在美国"
          }
        },
        {
          id: "identity_cn",
          label: "五到十年回国",
          description: "根还在国内",
          weights: { US: 0.5, CN: 1.3, THIRD: 0.7 },
          reasons: {
            CN: "你想在国内扎根"
          }
        },
        {
          id: "identity_global",
          label: "想要第三地身份",
          description: "多国布局",
          weights: { US: 0.6, CN: 0.6, THIRD: 1.2 },
          reasons: {
            THIRD: "你为第三地做规划"
          }
        },
        {
          id: "identity_unsure",
          label: "还不确定",
          description: "想留灵活",
          weights: { US: 0.6, CN: 0.6, THIRD: 0.6 }
        }
      ]
    }
  ];

  const FEATURE_KEYS = QUESTIONS.flatMap((question) =>
    ROUTES.map((route) => `${question.featurePrefix}_${route.toLowerCase()}`)
  );

  const FEATURE_INDEX = FEATURE_KEYS.reduce((acc, key, index) => {
    acc[key] = index;
    return acc;
  }, {});

  const FEATURE_REASON_LABEL = {
    career_us: "你想要大厂舞台",
    career_cn: "你看好国内岗位",
    career_third: "你追求国际化舞台",
    status_us: "你愿意押注美国身份",
    status_cn: "你想稳住国内身份",
    status_third: "你在寻找替代身份",
    finance_us: "你盯住高薪市场",
    finance_cn: "你想控制生活成本",
    finance_third: "你寻找成本友好的第三地",
    lifestyle_us: "你习惯快节奏城市",
    lifestyle_cn: "你依恋熟悉社区",
    lifestyle_third: "你想换个生活节奏",
    academic_us: "你重视科研舞台",
    academic_cn: "你看好国内导师资源",
    academic_third: "你愿意把学术延伸出去",
    support_us: "你的支持在美国",
    support_cn: "你的后盾在国内",
    support_third: "你在国际社群有连结",
    identity_us: "你把长线放在美国",
    identity_cn: "你想在国内扎根",
    identity_third: "你想多国布局"
  };

  const W = ROUTES.map((route) => {
    const current = route.toLowerCase();
    return FEATURE_KEYS.map((key) => {
      const suffix = key.split("_").pop();
      if (suffix === current) return 1.05;
      return -0.28;
    });
  });

  const BIAS = [0.6, 0.6, 0.6];

  function toFeatures(answerIds) {
    const vector = new Array(FEATURE_KEYS.length).fill(0);
    const reasonBuckets = { US: [], CN: [], THIRD: [] };

    QUESTIONS.forEach((question, index) => {
      const provided = answerIds[index];
      const option = question.options.find((opt) => opt.id === provided) || question.options[question.options.length - 1];
      ROUTES.forEach((route) => {
        const featureKey = `${question.featurePrefix}_${route.toLowerCase()}`;
        const idx = FEATURE_INDEX[featureKey];
        const weight = option.weights?.[route] ?? 0;
        vector[idx] += weight;
        if (option.reasons && option.reasons[route] && weight > 0.5) {
          reasonBuckets[route].push({
            impact: weight,
            text: option.reasons[route] || FEATURE_REASON_LABEL[featureKey]
          });
        } else if (weight > 0.7 && FEATURE_REASON_LABEL[featureKey]) {
          reasonBuckets[route].push({ impact: weight, text: FEATURE_REASON_LABEL[featureKey] });
        }
      });
    });

    return { vector, reasons: reasonBuckets };
  }

  function scoreEngine(answerIds) {
    const { vector, reasons } = toFeatures(answerIds);
    const raw = W.map((row, rowIndex) => {
      return row.reduce((sum, weight, index) => sum + weight * vector[index], BIAS[rowIndex]);
    });
    const max = Math.max(...raw);
    const exp = raw.map((value) => Math.exp(value - max));
    const denom = exp.reduce((sum, value) => sum + value, 0);
    const totals = exp.map((value) => Number(((value / denom) * 100).toFixed(1)));
    const ranking = ROUTES.map((route, index) => ({ route, score: totals[index] })).sort((a, b) => b.score - a.score);
    const winner = ranking[0];
    const rationale = buildRationale(winner.route, reasons);
    return { totals, ranking, rationale };
  }

  function buildRationale(route, reasons) {
    const picks = (reasons[route] || []).sort((a, b) => b.impact - a.impact);
    if (picks.length === 0) {
      return "你保持开放态度，小诺给出当前最平衡的方向。";
    }
    const fragments = picks.slice(0, 2).map((item) => item.text);
    return `${fragments.join("，")}，所以${ROUTE_LABELS[route]}更合拍。`;
  }

  function encodeAnswers(answerIds) {
    const payload = JSON.stringify(answerIds);
    if (typeof btoa === "function") {
      return btoa(encodeURIComponent(payload));
    }
    return Buffer.from(payload, "utf8").toString("base64");
  }

  function decodeAnswers(token) {
    if (!token) return null;
    try {
      const json = typeof atob === "function" ? decodeURIComponent(atob(token)) : Buffer.from(token, "base64").toString("utf8");
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  function persistAnswers(answerIds) {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answerIds));
    } catch (error) {
      console.warn("无法保存本地进度", error);
    }
  }

  function loadAnswers() {
    if (typeof localStorage === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      console.warn("无法读取本地进度", error);
      return null;
    }
  }

  function clearAnswers() {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("无法清除本地进度", error);
    }
  }

  function initQuizPage() {
    const hero = document.querySelector('[data-hero="main"]');
    const flow = document.getElementById("quiz-flow");
    const stage = document.getElementById("stage");
    const slides = document.getElementById("slides");
    const controls = document.getElementById("controls");
    const prevBtn = controls.querySelector('[data-action="prev"]');
    const nextBtn = controls.querySelector('[data-action="next"]');
    const startBtn = document.querySelector('[data-action="start"]');
    const progressBar = document.querySelector('[data-element="bar"]');
    const resultsSection = document.getElementById("results");
    const resultHeadline = resultsSection.querySelector('[data-field="headline"]');
    const rationaleField = resultsSection.querySelector('[data-field="rationale"]');
    const suggestion = document.getElementById("suggestion");
    const copyBtn = resultsSection.querySelector('[data-action="copy"]');
    const printBtn = resultsSection.querySelector('[data-action="print"]');
    const restartBtn = resultsSection.querySelector('[data-action="restart"]');

    const params = new URLSearchParams(window.location.search);
    const suggest = params.get("suggest");
    if (suggest && ROUTE_LABELS[suggest.toUpperCase()]) {
      suggestion.hidden = false;
      suggestion.textContent = `轻提示：优先看看${ROUTE_LABELS[suggest.toUpperCase()]}`;
    }

    let answers = new Array(QUESTIONS.length).fill(null);
    let currentIndex = 0;

    const sharedToken = params.get("a");
    if (sharedToken && window.location.hash.includes("result")) {
      const restored = decodeAnswers(sharedToken);
      if (restored) {
        answers = QUESTIONS.map((_, index) => restored[index] || null);
        hero.classList.add("is-hidden");
        flow.classList.remove("is-hidden");
        showResults();
        return;
      }
    }

    const saved = loadAnswers();
    if (saved) {
      answers = QUESTIONS.map((_, index) => saved[index] || null);
      const filledIndex = Math.min(saved.findIndex((value) => value === null), QUESTIONS.length - 1);
      currentIndex = filledIndex === -1 ? QUESTIONS.length - 1 : filledIndex;
      hero.classList.add("is-hidden");
      flow.classList.remove("is-hidden");
      stage.dataset.stage = "question";
      renderQuestion();
      updateProgress();
      return;
    }

    flow.classList.add("is-hidden");

    startBtn?.addEventListener("click", () => {
      startQuiz();
    });

    if (window.location.hash.includes("start")) {
      startQuiz();
    }

    function startQuiz() {
      hero.classList.add("is-hidden");
      flow.classList.remove("is-hidden");
      stage.dataset.stage = "question";
      currentIndex = 0;
      answers = new Array(QUESTIONS.length).fill(null);
      renderQuestion();
      updateProgress();
      persistAnswers(answers);
    }

    function renderQuestion() {
      const question = QUESTIONS[currentIndex];
      stage.dataset.stage = "question";
      resultsSection.hidden = true;
      slides.innerHTML = "";

      const wrapper = document.createElement("div");
      wrapper.className = "slide";

      const head = document.createElement("div");
      head.className = "slide-head";
      const title = document.createElement("h2");
      title.textContent = `${currentIndex + 1}. ${question.title}`;
      head.appendChild(title);
      if (question.note) {
        const note = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "题目旁注";
        const body = document.createElement("p");
        body.textContent = question.note;
        note.append(summary, body);
        head.appendChild(note);
      }
      wrapper.appendChild(head);

      const list = document.createElement("div");
      list.className = "option-list";
      question.options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option-card";
        button.dataset.optionId = option.id;
        if (answers[currentIndex] === option.id) {
          button.dataset.selected = "true";
        }
        const titleSpan = document.createElement("span");
        titleSpan.textContent = option.label;
        const desc = document.createElement("small");
        desc.textContent = option.description;
        button.append(titleSpan, desc);
        button.addEventListener("click", () => selectOption(option.id));
        list.appendChild(button);
      });
      wrapper.appendChild(list);
      slides.appendChild(wrapper);

      updateControls();
    }

    function selectOption(optionId) {
      answers[currentIndex] = optionId;
      persistAnswers(answers);
      renderQuestion();
    }

    function updateControls() {
      prevBtn.disabled = currentIndex === 0;
      const hasAnswer = Boolean(answers[currentIndex]);
      nextBtn.disabled = !hasAnswer && currentIndex < QUESTIONS.length - 1;
      nextBtn.textContent = currentIndex === QUESTIONS.length - 1 ? "看结果" : "下一题";
    }

    prevBtn.addEventListener("click", () => {
      if (currentIndex === 0) return;
      currentIndex -= 1;
      renderQuestion();
      updateProgress();
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex === QUESTIONS.length - 1) {
        if (!answers[currentIndex]) return;
        showResults();
        return;
      }
      if (!answers[currentIndex]) return;
      currentIndex += 1;
      renderQuestion();
      updateProgress();
    });

    document.addEventListener("keydown", (event) => {
      if (stage.dataset.stage !== "question") return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextBtn.click();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevBtn.click();
      }
    });

    function updateProgress() {
      const percent = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.setAttribute("aria-valuenow", String(percent));
      progressBar.setAttribute("aria-valuemax", "100");
      progressBar.setAttribute("aria-valuemin", "0");
      stage.dataset.index = String(currentIndex);
    }

    function showResults() {
      stage.dataset.stage = "result";
      resultsSection.hidden = false;
      const outcome = scoreEngine(answers);
      const best = outcome.ranking[0];
      resultHeadline.textContent = ROUTE_LABELS[best.route];
      rationaleField.textContent = outcome.rationale;
      updateBars(outcome);
      persistAnswers(answers);
      window.location.hash = "result";
    }

    function updateBars(outcome) {
      const byRoute = outcome.ranking.reduce((acc, item) => {
        acc[item.route] = item.score;
        return acc;
      }, {});
      resultsSection.querySelectorAll(".bar").forEach((row) => {
        const route = row.getAttribute("data-route");
        const value = byRoute[route] ?? 0;
        const fill = row.querySelector(".bar__fill");
        const label = row.querySelector(".bar__value");
        fill.style.width = `${value}%`;
        label.textContent = `${value.toFixed(1)}%`;
      });
    }

    copyBtn.addEventListener("click", async () => {
      const token = encodeAnswers(answers);
      const shareUrl = new URL(window.location.href);
      shareUrl.searchParams.set("a", token);
      shareUrl.hash = "result";
      try {
        await navigator.clipboard.writeText(shareUrl.toString());
        copyBtn.textContent = "已复制";
        setTimeout(() => (copyBtn.textContent = "复制结果链接"), 2000);
      } catch (error) {
        copyBtn.textContent = "复制失败";
        setTimeout(() => (copyBtn.textContent = "复制结果链接"), 2000);
      }
    });

    printBtn.addEventListener("click", () => {
      window.print();
    });

    restartBtn.addEventListener("click", () => {
      clearAnswers();
      answers = new Array(QUESTIONS.length).fill(null);
      currentIndex = 0;
      resultsSection.hidden = true;
      hero.classList.remove("is-hidden");
      flow.classList.add("is-hidden");
      stage.dataset.stage = "intro";
      window.location.hash = "start";
    });
  }

  function initHomePage() {
    // 当前无需额外逻辑，占位保留未来拓展。
  }

  function initLearnPage() {
    // 暂无额外脚本。
  }

  function boot() {
    if (typeof document === "undefined") return;
    const page = document.body?.dataset.page;
    if (page === "quiz") {
      initQuizPage();
    } else if (page === "learn") {
      initLearnPage();
    } else {
      initHomePage();
    }
  }

  const api = {
    ROUTES,
    QUESTIONS,
    toFeatures,
    scoreEngine,
    encodeAnswers,
    decodeAnswers
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.App = api;
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", boot);
  }
})(typeof window !== "undefined" ? window : globalThis);
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
