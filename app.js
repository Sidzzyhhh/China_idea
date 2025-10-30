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
