import {
  factors,
  regressionMatrix,
  calculateScores,
  buildCallouts,
  generateInsights,
  normalizeSliderValue,
  pathMeta,
  rankPaths,
} from './scoring.js';

const factorGrid = document.getElementById('factorGrid');
const scoreboard = document.getElementById('scoreboard');
const calloutsContainer = document.getElementById('callouts');
const insightList = document.getElementById('insightList');
const insightPanel = document.getElementById('insightPanel');

const initialPriorities = Object.fromEntries(
  factors.map((factor) => [factor.id, normalizeSliderValue(factor.defaultValue)])
);

const state = {
  priorities: { ...initialPriorities },
};

function renderFactorCards() {
  factorGrid.innerHTML = '';

  factors.forEach((factor) => {
    const card = document.createElement('article');
    card.className = 'factor-card';
    card.setAttribute('data-factor', factor.id);

    const head = document.createElement('div');
    head.className = 'factor-head';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'factor-title';

    const h3 = document.createElement('h3');
    h3.textContent = factor.title;
    titleWrap.appendChild(h3);

    const tag = document.createElement('span');
    tag.textContent = factor.tagline;
    titleWrap.appendChild(tag);

    const icon = document.createElement('div');
    icon.className = 'factor-icon';
    icon.textContent = factor.icon;

    head.appendChild(titleWrap);
    head.appendChild(icon);

    const description = document.createElement('p');
    description.className = 'factor-description';
    description.textContent = factor.description;

    const cues = document.createElement('div');
    cues.className = 'quick-tags';
    factor.cues.forEach((cue) => {
      const chip = document.createElement('span');
      chip.textContent = cue;
      cues.appendChild(chip);
    });

    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slider-wrapper';

    const sliderLabels = document.createElement('div');
    sliderLabels.className = 'slider-labels';
    sliderLabels.innerHTML = `<span>${factor.lowLabel}</span><span>${factor.highLabel}</span>`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '10';
    slider.value = factor.defaultValue.toString();
    slider.setAttribute('aria-label', `${factor.title} 权重`);

    const sliderValue = document.createElement('div');
    sliderValue.className = 'slider-value';
    sliderValue.textContent = `权重：${factor.defaultValue}`;

    slider.addEventListener('input', (event) => {
      const value = Number.parseInt(event.target.value, 10);
      sliderValue.textContent = `权重：${value}`;
      state.priorities[factor.id] = normalizeSliderValue(value);
      updateScores();
    });

    sliderWrapper.appendChild(sliderLabels);
    sliderWrapper.appendChild(slider);
    sliderWrapper.appendChild(sliderValue);

    card.appendChild(head);
    card.appendChild(description);
    card.appendChild(cues);
    card.appendChild(sliderWrapper);
    factorGrid.appendChild(card);
  });
}

function renderScoreboard({ normalized }) {
  scoreboard.innerHTML = '';
  const ranking = rankPaths(normalized);

  ranking.forEach((path) => {
    const meta = pathMeta[path];
    const score = normalized[path];

    const wrapper = document.createElement('div');
    wrapper.className = 'scorebar';

    const header = document.createElement('div');
    header.className = 'scorebar-header';
    header.innerHTML = `<span>${meta.label}</span><span>${score}</span>`;

    const track = document.createElement('div');
    track.className = 'scorebar-track';

    const fill = document.createElement('div');
    fill.className = 'scorebar-fill';
    fill.style.width = `${Math.max(score, 4)}%`;

    track.appendChild(fill);
    wrapper.appendChild(header);
    wrapper.appendChild(track);

    const tone = document.createElement('p');
    tone.className = 'factor-description';
    tone.textContent = meta.tone;

    wrapper.appendChild(tone);
    scoreboard.appendChild(wrapper);
  });
}

function renderCallouts(scores) {
  const callouts = buildCallouts(scores, state.priorities);
  calloutsContainer.innerHTML = '';

  callouts.forEach((item) => {
    const callout = document.createElement('div');
    callout.className = 'callout';
    const title = document.createElement('h4');
    title.textContent = item.title;
    const body = document.createElement('p');
    body.textContent = item.body;
    callout.appendChild(title);
    callout.appendChild(body);
    calloutsContainer.appendChild(callout);
  });
}

function renderInsights(scores) {
  const insights = generateInsights(scores, state.priorities);
  insightList.innerHTML = '';

  insights.forEach((item) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    term.textContent = item.term;
    const detail = document.createElement('dd');
    detail.textContent = item.detail;
    row.appendChild(term);
    row.appendChild(detail);
    insightList.appendChild(row);
  });

  insightPanel.classList.toggle('active', true);
}

function updateScores() {
  const scores = calculateScores(state.priorities, regressionMatrix);
  renderScoreboard(scores);
  renderCallouts(scores);
  renderInsights(scores);
}

function bindShortcuts() {
  const startButton = document.getElementById('startScoring');
  const scrollButton = document.getElementById('scrollToScoring');
  const scoringSection = document.getElementById('scoring');

  function scrollToSection(event) {
    event?.preventDefault?.();
    scoringSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  startButton?.addEventListener('click', scrollToSection);
  scrollButton?.addEventListener('click', scrollToSection);
}

renderFactorCards();
bindShortcuts();
updateScores();
