import { factors } from './scoring.js';
import {
  readPriorities,
  writePriorities,
  toSliderValue,
  fromSliderValue,
  buildDefaultPriorities,
} from './state.js';

const progressList = document.getElementById('progressList');
const factorTitle = document.getElementById('factorTitle');
const factorTag = document.getElementById('factorTag');
const factorDescription = document.getElementById('factorDescription');
const factorCues = document.getElementById('factorCues');
const slider = document.getElementById('factorSlider');
const sliderLabels = document.getElementById('sliderLabels');
const sliderValue = document.getElementById('sliderValue');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const finishButton = document.getElementById('finishButton');
const resetButton = document.getElementById('resetButton');
const asideSummary = document.getElementById('asideSummary');
const weightPreview = document.getElementById('weightPreview');
const completedCount = document.getElementById('completedCount');

const defaultPriorities = buildDefaultPriorities();
let priorities = readPriorities();
let currentIndex = 0;
const visited = new Set();

factors.forEach((factor, index) => {
  const base = defaultPriorities[factor.id] ?? 0;
  const value = priorities[factor.id] ?? base;
  if (Math.abs(value - base) > 0.001) {
    visited.add(index);
  }
});

function persist() {
  writePriorities(priorities);
}

function renderProgress() {
  progressList.innerHTML = '';
  factors.forEach((factor, index) => {
    const chip = document.createElement('span');
    chip.className = 'progress-item';
    chip.dataset.index = String(index);
    chip.textContent = `${String(index + 1).padStart(2, '0')} · ${factor.title}`;
    chip.dataset.active = index === currentIndex ? 'true' : 'false';
    chip.dataset.visited = visited.has(index) ? 'true' : 'false';
    chip.addEventListener('click', () => {
      currentIndex = index;
      updateView();
    });
    progressList.appendChild(chip);
  });
}

function renderAsideSummary() {
  asideSummary.innerHTML = '';
  factors.forEach((factor) => {
    const item = document.createElement('span');
    item.innerHTML = `<strong>${factor.title}</strong> · ${factor.tagline}`;
    asideSummary.appendChild(item);
  });
}

function renderWeightPreview() {
  weightPreview.innerHTML = '';
  factors.forEach((factor, index) => {
    const value = priorities[factor.id] ?? 0;
    const sliderEquivalent = toSliderValue(value);
    const item = document.createElement('span');
    item.textContent = `${String(index + 1).padStart(2, '0')} ${factor.title} · ${sliderEquivalent}/10`;
    weightPreview.appendChild(item);
  });

  const count = new Set([...visited, currentIndex]).size;
  completedCount.textContent = `${count}/${factors.length}`;
}

function updateView() {
  const factor = factors[currentIndex];
  const normalized = priorities[factor.id] ?? 0;
  factorTitle.textContent = factor.title;
  factorTag.textContent = factor.tagline;
  factorDescription.textContent = factor.description;

  sliderLabels.innerHTML = `<span>${factor.lowLabel}</span><span>${factor.highLabel}</span>`;

  factorCues.innerHTML = '';
  factor.cues.forEach((cue) => {
    const chip = document.createElement('span');
    chip.textContent = cue;
    factorCues.appendChild(chip);
  });

  const sliderNumber = toSliderValue(normalized);
  slider.value = String(sliderNumber);
  sliderValue.textContent = `权重：${sliderNumber}`;

  renderProgress();
  renderWeightPreview();
  updateButtons();
}

function updateButtons() {
  prevButton.disabled = currentIndex === 0;
  nextButton.hidden = currentIndex >= factors.length - 1;
  finishButton.hidden = currentIndex < factors.length - 1;
}

slider.addEventListener('input', (event) => {
  const rawValue = Number.parseInt(event.target.value, 10);
  sliderValue.textContent = `权重：${rawValue}`;
  const factor = factors[currentIndex];
  const normalized = fromSliderValue(rawValue);
  priorities = {
    ...priorities,
    [factor.id]: normalized,
  };
  const baseline = defaultPriorities[factor.id] ?? 0;
  if (Math.abs(normalized - baseline) > 0.001) {
    visited.add(currentIndex);
  } else {
    visited.delete(currentIndex);
  }
  persist();
  renderProgress();
  renderWeightPreview();
});

prevButton.addEventListener('click', () => {
  if (currentIndex === 0) return;
  currentIndex -= 1;
  updateView();
});

nextButton.addEventListener('click', () => {
  if (currentIndex >= factors.length - 1) return;
  currentIndex += 1;
  updateView();
});

resetButton.addEventListener('click', () => {
  const factor = factors[currentIndex];
  const baseline = defaultPriorities[factor.id] ?? fromSliderValue(factor.defaultValue);
  const defaultValue = toSliderValue(baseline);
  slider.value = String(defaultValue);
  sliderValue.textContent = `权重：${defaultValue}`;
  priorities = {
    ...priorities,
    [factor.id]: baseline,
  };
  visited.delete(currentIndex);
  persist();
  renderProgress();
  renderWeightPreview();
});

renderAsideSummary();
renderProgress();
renderWeightPreview();
updateView();
