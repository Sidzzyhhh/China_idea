import { factors, normalizeSliderValue } from './scoring.js';

const STORAGE_KEY = 'crossroads-lab-priorities';

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage;
    }
  } catch (error) {
    // ignore storage access errors (privacy mode etc.)
  }
  return undefined;
}

export function buildDefaultPriorities() {
  return Object.fromEntries(
    factors.map((factor) => [factor.id, normalizeSliderValue(factor.defaultValue)])
  );
}

export function readPriorities() {
  const storage = getStorage();
  if (!storage) return buildDefaultPriorities();

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return buildDefaultPriorities();

  try {
    const parsed = JSON.parse(raw);
    const priorities = buildDefaultPriorities();
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'number' && Number.isFinite(value)) {
        priorities[key] = Math.min(Math.max(value, 0), 1);
      }
    }
    return priorities;
  } catch (error) {
    return buildDefaultPriorities();
  }
}

export function writePriorities(priorities) {
  const storage = getStorage();
  if (!storage) return;
  const payload = {};
  for (const [key, value] of Object.entries(priorities)) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      payload[key] = Math.min(Math.max(value, 0), 1);
    }
  }
  storage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function updatePriority(factorId, normalizedValue) {
  const next = readPriorities();
  next[factorId] = Math.min(Math.max(normalizedValue, 0), 1);
  writePriorities(next);
  return next;
}

export function toSliderValue(normalizedValue) {
  return Math.round(Math.min(Math.max(normalizedValue, 0), 1) * 10);
}

export function fromSliderValue(value) {
  return normalizeSliderValue(typeof value === 'number' ? value : Number(value));
}

export { STORAGE_KEY };
