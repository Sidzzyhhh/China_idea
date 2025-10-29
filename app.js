(function (global) {
  const FEATURE_LIST = [
    { key: 'scale', label: '大舞台' },
    { key: 'startup', label: '创业弹性' },
    { key: 'academia', label: '学术纵深' },
    { key: 'visa', label: '身份稳定' },
    { key: 'opt', label: '短期身份' },
    { key: 'green', label: '长期身份' },
    { key: 'salary', label: '收入空间' },
    { key: 'cost', label: '成本敏感' },
    { key: 'family', label: '家庭靠近' },
    { key: 'community', label: '熟悉社群' },
    { key: 'global', label: '全球探索' },
    { key: 'research', label: '导师资源' },
    { key: 'network', label: '人脉支持' },
    { key: 'identity', label: '长期认同' }
  ];

  const FEATURE_INDEX = FEATURE_LIST.reduce((acc, feature, index) => {
    acc[feature.key] = index;
    return acc;
  }, {});

  const DESTINATIONS = [
    { key: 'us', name: '美国路径' },
    { key: 'cn', name: '中国发展' },
    { key: 'third', name: '第三地探索' }
  ];

  const QUESTIONS = [
    {
      id: 'stage',
      title: '职业舞台',
      subtitle: '你想先在哪种舞台证明自己？',
      type: 'single',
      options: [
        { value: 'bigco', label: '大厂', features: { scale: 1, salary: 0.4, research: 0.2 } },
        { value: 'startup', label: '初创', features: { startup: 1, global: 0.4 } },
        { value: 'academic', label: '学术', features: { academia: 1, research: 1 } },
        { value: 'unsure', label: '还不确定', features: {} }
      ]
    },
    {
      id: 'status',
      title: '身份路径',
      subtitle: '哪种身份安排最让你安心？',
      type: 'single',
      options: [
        { value: 'h1b', label: 'H-1B 下注', features: { visa: 1, opt: 0.5 } },
        { value: 'opt', label: 'OPT 或 STEM OPT', features: { opt: 1, global: 0.3 } },
        { value: 'gc', label: '长期绿卡路径', features: { green: 1, family: 0.2 } },
        { value: 'unknown', label: '不确定', features: {} }
      ]
    },
    {
      id: 'money',
      title: '收入与成本',
      subtitle: '先想钱，还是先顾生活成本？',
      type: 'single',
      options: [
        { value: 'salary', label: '薪资预期', features: { salary: 1 } },
        { value: 'cost', label: '生活成本', features: { cost: 1 } },
        { value: 'family', label: '家庭支持', features: { family: 1, community: 0.5 } },
        { value: 'unsure', label: '不确定', features: {} }
      ]
    },
    {
      id: 'life',
      title: '生活方式',
      subtitle: '什么样的日常让你心里踏实？',
      type: 'single',
      options: [
        { value: 'pace', label: '城市节奏', features: { scale: 0.6, global: 0.4 } },
        { value: 'community', label: '社区归属', features: { community: 1, family: 0.4 } },
        { value: 'climate', label: '气候偏好', features: { global: 0.5 } },
        { value: 'unsure', label: '不确定', features: {} }
      ]
    },
    {
      id: 'academic',
      title: '学术路线',
      subtitle: '你怎么规划下一段学习或研究？',
      type: 'single',
      options: [
        { value: 'phd', label: '读博/博后', features: { academia: 0.8, research: 1 } },
        { value: 'mentor', label: '导师资源', features: { research: 1, network: 0.6 } },
        { value: 'applied', label: '应用项目', features: { startup: 0.4, scale: 0.4 } },
        { value: 'unknown', label: '不确定', features: {} }
      ]
    },
    {
      id: 'support',
      title: '支持网络',
      subtitle: '谁会和你一起扛？（可多选）',
      type: 'multi',
      options: [
        { value: 'family', label: '亲友', features: { family: 1, community: 0.6 } },
        { value: 'partner', label: '伴侣', features: { identity: 0.6, community: 0.4 } },
        { value: 'alumni', label: '校友圈', features: { network: 1 } },
        { value: 'unsure', label: '不确定', features: {} }
      ]
    },
    {
      id: 'identity',
      title: '长期认同',
      subtitle: '五到十年后，你想怎么介绍自己？',
      type: 'single',
      options: [
        { value: 'global', label: '全球游牧者', features: { global: 1, identity: 0.8 } },
        { value: 'home', label: '回到熟悉圈子', features: { community: 0.8, family: 0.7, identity: 1 } },
        { value: 'hybrid', label: '两边都熟的人', features: { global: 0.7, identity: 1 } },
        { value: 'unsure', label: '还不确定', features: {} }
      ]
    }
  ];

  const WEIGHT_MATRIX = [
    // us
    [1.2, 0.4, 0.9, 0.8, 0.9, 0.2, 1.1, -0.4, -0.2, 0.2, 0.7, 1.0, 0.4, 0.5],
    // cn
    [0.8, 0.3, 0.6, 0.7, 0.2, 1.1, 0.6, 0.9, 1.2, 1.0, 0.2, 0.7, 1.1, 1.0],
    // third
    [0.6, 1.1, 0.4, 0.3, 0.5, 0.4, 0.7, 0.6, 0.2, 0.4, 1.3, 0.5, 0.6, 0.9]
  ];

  const BIAS = [0.2, 0.2, 0.2];

  const FEATURE_REASON = {
    scale: '你想站上更大的舞台',
    startup: '你渴望掌控节奏',
    academia: '你在乎学术纵深',
    visa: '你优先考虑身份稳定',
    opt: '你愿意先累积短期经验',
    green: '你想要长期身份保障',
    salary: '你盯着收入空间',
    cost: '你关注生活成本',
    family: '你希望离家近一些',
    community: '你想留在熟悉的社群',
    global: '你想换个世界视角',
    research: '你要抓住导师资源',
    network: '你重视人脉扶持',
    identity: '你在寻找长期认同'
  };

  const STORAGE_KEY = 'nori-answers-v1';

  function toFeatures(answerMap) {
    const vector = new Array(FEATURE_LIST.length).fill(0);
    const contributions = new Array(FEATURE_LIST.length).fill(0);

    QUESTIONS.forEach((question) => {
      const selections = answerMap[question.id] || [];
      selections.forEach((value) => {
        const option = question.options.find((opt) => opt.value === value);
        if (!option) return;
        Object.entries(option.features).forEach(([featureKey, weight]) => {
          if (FEATURE_INDEX[featureKey] === undefined) return;
          const idx = FEATURE_INDEX[featureKey];
          vector[idx] += weight;
          contributions[idx] += weight;
        });
      });
    });

    return { vector, contributions };
  }

  function scoreEngine(answerMap) {
    const { vector, contributions } = toFeatures(answerMap);
    const rawScores = DESTINATIONS.map((dest, rowIndex) => {
      const weights = WEIGHT_MATRIX[rowIndex];
      let sum = BIAS[rowIndex] || 0;
      weights.forEach((w, colIndex) => {
        sum += w * vector[colIndex];
      });
      return sum;
    });

    const maxRaw = Math.max(...rawScores);
    const expScores = rawScores.map((score) => Math.exp(score - maxRaw));
    const expSum = expScores.reduce((acc, value) => acc + value, 0);
    const totals = expScores.map((value) => Math.round((value / expSum) * 1000) / 10);

    const ranking = DESTINATIONS
      .map((dest, index) => ({ key: dest.key, name: dest.name, total: totals[index], raw: rawScores[index], rowIndex: index }))
      .sort((a, b) => b.total - a.total || b.raw - a.raw);

    const top = ranking[0];
    let rationale = '答案还太模糊，下次可以多选几个选项。';

    if (top) {
      const weights = WEIGHT_MATRIX[top.rowIndex];
      const contributionsByFeature = FEATURE_LIST.map((feature, index) => ({
        key: feature.key,
        label: feature.label,
        value: contributions[index] * weights[index]
      }));

      const sortedReasons = contributionsByFeature
        .filter((item) => item.value > 0.05)
        .sort((a, b) => b.value - a.value)
        .slice(0, 2);

      if (sortedReasons.length > 0) {
        const parts = sortedReasons.map((item) => FEATURE_REASON[item.key] || `你在意${item.label}`);
        rationale = `${parts.join('，')}，${top.name}更对味。`;
      } else {
        rationale = `你给出的答案指向 ${top.name}。再多尝试几轮，方向会更清晰。`;
      }
    }

    return { totals, ranking, rationale };
  }

  function encodeAnswers(answerMap) {
    const json = JSON.stringify(answerMap);
    if (typeof window !== 'undefined' && window.btoa) {
      return window.btoa(json);
    }
    return Buffer.from(json, 'utf8').toString('base64');
  }

  function decodeAnswers(param) {
    if (!param) return {};
    try {
      const json = typeof window !== 'undefined' && window.atob ? window.atob(param) : Buffer.from(param, 'base64').toString('utf8');
      const parsed = JSON.parse(json);
      return Object.keys(parsed).reduce((acc, key) => {
        const value = parsed[key];
        acc[key] = Array.isArray(value) ? value : [];
        return acc;
      }, {});
    } catch (error) {
      return {};
    }
  }

  function persistState(answerMap, currentIndex) {
    if (typeof localStorage === 'undefined') return;
    const payload = { answers: answerMap, index: currentIndex };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function restoreState() {
    if (typeof localStorage === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function clearState() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  function setupBrowser() {
    if (typeof document === 'undefined') return;
    const slidesContainer = document.querySelector('#slides');
    const progressBar = document.querySelector('.progress__bar');
    const suggestionEl = document.querySelector('.suggestion');
    const hero = document.querySelector('[data-hero="main"]');

    if (!slidesContainer || !progressBar) return;

    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    let state = restoreState() || { answers: {}, index: 0 };

    if (params.has('a')) {
      state.answers = decodeAnswers(params.get('a'));
      state.index = QUESTIONS.length;
    }

    if (hash === '#start') {
      state.index = 0;
    }

    if (params.has('suggest') && suggestionEl) {
      const target = params.get('suggest');
      const match = DESTINATIONS.find((dest) => dest.key === target);
      if (match) {
        suggestionEl.hidden = false;
        suggestionEl.textContent = `小诺提示：可以优先看看 ${match.name}`;
      }
    }

    renderSlides(slidesContainer, state.answers);
    updateUI(state.index);

    const startButton = document.querySelector('[data-start]');
    const skipIntroButton = document.querySelector('[data-skip-intro]');
    const restartLinks = document.querySelectorAll('[data-action="restart"]');

    if (startButton) {
      startButton.addEventListener('click', () => {
        hero.setAttribute('hidden', '');
        state.index = 0;
        updateUI(state.index);
        persistState(state.answers, state.index);
        slidesContainer.focus();
      });
    }

    if (skipIntroButton) {
      skipIntroButton.addEventListener('click', () => {
        hero.setAttribute('hidden', '');
        state.index = 0;
        updateUI(state.index);
        persistState(state.answers, state.index);
      });
    }

    restartLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        clearState();
        state = { answers: {}, index: 0 };
        renderSlides(slidesContainer, state.answers);
        updateUI(state.index);
        hero.removeAttribute('hidden');
        window.history.replaceState({}, '', 'quiz.html#start');
      });
    });

    slidesContainer.addEventListener('change', (event) => {
      const target = event.target;
      const slideEl = target.closest('.slide');
      if (!slideEl) return;
      const questionId = slideEl.dataset.question;
      const question = QUESTIONS.find((q) => q.id === questionId);
      if (!question) return;

      if (question.type === 'single') {
        state.answers[questionId] = [target.value];
      } else {
        const selected = Array.from(slideEl.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
        state.answers[questionId] = selected;
      }
      persistState(state.answers, state.index);
      updateButtonState(slideEl, question, state.answers[questionId]);
    });

    slidesContainer.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'prev') {
        state.index = Math.max(0, state.index - 1);
      }
      if (action === 'next') {
        state.index = Math.min(QUESTIONS.length, state.index + 1);
      }
      if (action === 'finish') {
        state.index = QUESTIONS.length;
      }
      persistState(state.answers, state.index);
      updateUI(state.index);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextButton = slidesContainer.querySelector('.slide[data-active="true"] button[data-action="next"], .slide[data-active="true"] button[data-action="finish"]');
        if (nextButton && !nextButton.disabled) {
          nextButton.click();
        }
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevButton = slidesContainer.querySelector('.slide[data-active="true"] button[data-action="prev"]');
        if (prevButton) {
          prevButton.click();
        }
      }
    });

    function updateUI(index) {
      const slides = Array.from(slidesContainer.querySelectorAll('.slide'));
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.dataset.active = active ? 'true' : 'false';
        slide.hidden = !active;
      });

      const progress = index >= QUESTIONS.length ? 100 : Math.round((index / QUESTIONS.length) * 100);
      progressBar.style.width = `${progress}%`;

      if (index > 0) {
        hero.setAttribute('hidden', '');
      }

      slides.forEach((slide) => {
        const questionId = slide.dataset.question;
        const question = QUESTIONS.find((q) => q.id === questionId);
        if (!question) return;
        const answers = state.answers[questionId] || [];
        updateButtonState(slide, question, answers);
      });

      if (index === QUESTIONS.length) {
        renderResult(slidesContainer, state.answers);
      }
    }

    function updateButtonState(slideEl, question, answers) {
      const nextButton = slideEl.querySelector('button[data-action="next"], button[data-action="finish"]');
      if (!nextButton) return;
      const hasAnswer = Array.isArray(answers) && answers.length > 0;
      nextButton.disabled = !hasAnswer;
    }

    function renderSlides(container, answers) {
      container.innerHTML = '';
      QUESTIONS.forEach((question, index) => {
        const slide = document.createElement('article');
        slide.className = 'slide';
        slide.dataset.question = question.id;
        slide.dataset.active = 'false';
        slide.hidden = true;
        slide.setAttribute('aria-labelledby', `${question.id}-title`);

        const meta = document.createElement('div');
        meta.className = 'slide__meta';
        meta.innerHTML = `<span>${index + 1} / ${QUESTIONS.length}</span><span>${Math.round(((index + 1) / QUESTIONS.length) * 100)}%</span>`;

        const title = document.createElement('h2');
        title.className = 'slide__title';
        title.id = `${question.id}-title`;
        title.textContent = question.title;

        const subtitle = document.createElement('p');
        subtitle.className = 'hero__subtitle';
        subtitle.textContent = question.subtitle;

        const optionsWrap = document.createElement('div');
        optionsWrap.className = 'options';

        question.options.forEach((option) => {
          const optionId = `${question.id}-${option.value}`;
          const optionEl = document.createElement('div');
          optionEl.className = 'option';

          const input = document.createElement('input');
          input.id = optionId;
          input.name = question.id;
          input.value = option.value;
          input.type = question.type === 'multi' ? 'checkbox' : 'radio';
          input.required = false;

          if (answers[question.id] && answers[question.id].includes(option.value)) {
            input.checked = true;
          }

          const label = document.createElement('label');
          label.setAttribute('for', optionId);
          label.textContent = option.label;

          optionEl.appendChild(label);
          optionEl.appendChild(input);
          optionsWrap.appendChild(optionEl);
        });

        const controls = document.createElement('div');
        controls.className = 'controls';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn--ghost';
        prevBtn.type = 'button';
        prevBtn.dataset.action = 'prev';
        prevBtn.textContent = '上一步';
        prevBtn.disabled = index === 0;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn--primary';
        nextBtn.type = 'button';
        nextBtn.dataset.action = index === QUESTIONS.length - 1 ? 'finish' : 'next';
        nextBtn.textContent = index === QUESTIONS.length - 1 ? '看结果' : '下一步';
        nextBtn.disabled = !(answers[question.id] && answers[question.id].length > 0);

        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);

        slide.appendChild(meta);
        slide.appendChild(title);
        slide.appendChild(subtitle);
        slide.appendChild(optionsWrap);
        slide.appendChild(controls);

        container.appendChild(slide);
      });

      const resultSlide = document.createElement('article');
      resultSlide.className = 'slide';
      resultSlide.dataset.question = 'result';
      resultSlide.dataset.active = 'false';
      resultSlide.hidden = true;
      container.appendChild(resultSlide);
    }

    function renderResult(container, answers) {
      const resultSlide = container.querySelector('.slide[data-question="result"]');
      if (!resultSlide) return;
      resultSlide.innerHTML = '';
      resultSlide.dataset.active = 'true';
      resultSlide.hidden = false;

      const { ranking, totals, rationale } = scoreEngine(answers);
      const top = ranking[0];

      const title = document.createElement('h2');
      title.className = 'result__title';
      title.textContent = top ? `推荐：${top.name}` : '暂时没有结果';

      const bars = document.createElement('div');
      bars.className = 'result__bars';

      ranking.forEach((item) => {
        const bar = document.createElement('div');
        bar.className = 'result__bar';
        const label = document.createElement('span');
        label.textContent = `${item.name}`;
        const track = document.createElement('div');
        track.style.setProperty('--value', `${item.total}%`);
        const value = document.createElement('strong');
        value.textContent = `${item.total.toFixed(1)}%`;
        bar.appendChild(label);
        bar.appendChild(track);
        bar.appendChild(value);
        bars.appendChild(bar);
      });

      const reason = document.createElement('p');
      reason.className = 'result__reason';
      reason.textContent = rationale;

      const actions = document.createElement('div');
      actions.className = 'result__actions';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn--primary';
      copyBtn.type = 'button';
      copyBtn.textContent = '复制结果链接';
      copyBtn.addEventListener('click', () => {
        const encoded = encodeAnswers(answers);
        const url = new URL(window.location.href);
        url.searchParams.set('a', encoded);
        url.hash = 'result';
        url.searchParams.delete('suggest');
        navigator.clipboard?.writeText(url.toString()).then(() => {
          copyBtn.textContent = '已复制';
          setTimeout(() => (copyBtn.textContent = '复制结果链接'), 1800);
        }).catch(() => {
          window.prompt('复制此链接', url.toString());
        });
      });

      const printBtn = document.createElement('button');
      printBtn.className = 'btn btn--ghost';
      printBtn.type = 'button';
      printBtn.textContent = '打印';
      printBtn.addEventListener('click', () => window.print());

      const restartBtn = document.createElement('button');
      restartBtn.className = 'btn btn--ghost';
      restartBtn.type = 'button';
      restartBtn.textContent = '重新开始';
      restartBtn.addEventListener('click', () => {
        clearState();
        window.location.href = 'quiz.html#start';
      });

      actions.appendChild(copyBtn);
      actions.appendChild(printBtn);
      actions.appendChild(restartBtn);

      const mascotWrap = document.createElement('img');
      mascotWrap.className = 'mascot';
      mascotWrap.src = 'brand/mascot.svg';
      mascotWrap.alt = '小诺灵光一现';
      mascotWrap.dataset.state = 'idea';

      const wrapper = document.createElement('div');
      wrapper.className = 'result';
      wrapper.appendChild(title);
      wrapper.appendChild(mascotWrap);
      wrapper.appendChild(bars);
      wrapper.appendChild(reason);
      wrapper.appendChild(actions);

      resultSlide.appendChild(wrapper);
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupBrowser);
    } else {
      setupBrowser();
    }
  }

  const exported = {
    QUESTIONS,
    FEATURE_LIST,
    DESTINATIONS,
    toFeatures,
    scoreEngine,
    encodeAnswers,
    decodeAnswers
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  } else {
    global.Nori = exported;
  }
})(typeof window !== 'undefined' ? window : globalThis);
