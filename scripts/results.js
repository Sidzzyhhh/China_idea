import {
  calculateScores,
  regressionMatrix,
  pathMeta,
  buildCallouts,
  generateInsights,
  rankPaths,
  factors,
} from './scoring.js';
import { readPriorities, toSliderValue } from './state.js';

const scoreboard = document.getElementById('scoreboard');
const calloutsContainer = document.getElementById('callouts');
const insightList = document.getElementById('insightList');
const weightRecap = document.getElementById('weightRecap');
const resultMeta = document.getElementById('resultMeta');

const priorities = readPriorities();
const scores = calculateScores(priorities, regressionMatrix);
const ranking = rankPaths(scores.normalized);

function renderMeta() {
  resultMeta.innerHTML = '';
  if (ranking.length === 0) return;
  const topPath = ranking[0];
  const topScore = scores.normalized[topPath] ?? 0;
  const meta = document.createElement('span');
  meta.textContent = `领先路径：${pathMeta[topPath].label} · ${topScore}分`;
  resultMeta.appendChild(meta);

  if (ranking.length > 1) {
    const runnerUp = ranking[1];
    const delta = Math.abs(topScore - (scores.normalized[runnerUp] ?? 0));
    const deltaNode = document.createElement('span');
    deltaNode.textContent = `分差：${delta} 分`;
    resultMeta.appendChild(deltaNode);
  }

  const sliderSum = factors.reduce(
    (acc, factor) => acc + toSliderValue(priorities[factor.id] ?? 0),
    0
  );
  const totalNode = document.createElement('span');
  totalNode.textContent = `滑杆总和：${sliderSum}/60`;
  resultMeta.appendChild(totalNode);
}

function renderScoreboard() {
  scoreboard.innerHTML = '';
  ranking.forEach((path) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'scorebar';

    const header = document.createElement('div');
    header.className = 'scorebar-header';
    header.innerHTML = `<span>${pathMeta[path].label}</span><span>${scores.normalized[path] ?? 0}</span>`;

    const track = document.createElement('div');
    track.className = 'scorebar-track';

    const fill = document.createElement('div');
    fill.className = 'scorebar-fill';
    fill.style.width = `${Math.max(scores.normalized[path] ?? 0, 4)}%`;

    const tone = document.createElement('small');
    tone.textContent = pathMeta[path].tone;

    track.appendChild(fill);
    wrapper.appendChild(header);
    wrapper.appendChild(track);
    wrapper.appendChild(tone);
    scoreboard.appendChild(wrapper);
  });
}

function renderCallouts() {
  calloutsContainer.innerHTML = '';
  const callouts = buildCallouts(scores, priorities);
  callouts.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'callout';
    const title = document.createElement('h3');
    title.textContent = item.title;
    const body = document.createElement('p');
    body.textContent = item.body;
    card.appendChild(title);
    card.appendChild(body);
    calloutsContainer.appendChild(card);
  });
}

function renderInsights() {
  insightList.innerHTML = '';
  const insights = generateInsights(scores, priorities);
  insights.forEach((item) => {
    const term = document.createElement('dt');
    term.textContent = item.term;
    const detail = document.createElement('dd');
    detail.textContent = item.detail;
    insightList.appendChild(term);
    insightList.appendChild(detail);
  });
}

function renderWeights() {
  weightRecap.innerHTML = '';
  factors.forEach((factor) => {
    const chip = document.createElement('div');
    chip.className = 'weight-chip';
    const score = toSliderValue(priorities[factor.id] ?? 0);
    chip.innerHTML = `<span>${factor.title}</span><span>${score}/10</span>`;
    weightRecap.appendChild(chip);
  });
}

renderMeta();
renderScoreboard();
renderCallouts();
renderInsights();
renderWeights();
