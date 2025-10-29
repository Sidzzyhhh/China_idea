import assert from 'node:assert/strict';
import {
  QUESTIONS,
  FEATURE_KEYS,
  toFeatures,
  scoreEngine,
  serializeAnswers,
  parseAnswers
} from '../app.js';

const suite = [];

function test(name, fn) {
  suite.push({ name, fn });
}

test('toFeatures maps selections into feature vector', () => {
  const answers = { career: 'bigtech', visa: 'h1b' };
  const vector = toFeatures(answers);
  assert.equal(vector.length, FEATURE_KEYS.length);
  const bigtechIndex = FEATURE_KEYS.indexOf('career_bigtech');
  assert.ok(vector[bigtechIndex] > 0, 'bigtech feature should be activated');
});

test('scoreEngine favors US profile', () => {
  const answers = {
    career: 'bigtech',
    visa: 'h1b',
    finance: 'salary',
    life: 'fast',
    academic: 'mentor',
    support: 'alumni',
    identity: 'us'
  };
  const { ranking, totals } = scoreEngine(answers);
  assert.equal(ranking[0], 'us');
  assert.ok(totals.us > totals.cn);
  assert.ok(totals.us > totals.third);
});

test('scoreEngine favors China profile', () => {
  const answers = {
    career: 'academic',
    visa: 'permanent',
    finance: 'family',
    life: 'city',
    academic: 'mentor',
    support: 'family',
    identity: 'cn'
  };
  const { ranking } = scoreEngine(answers);
  assert.equal(ranking[0], 'cn');
});

test('scoreEngine favors third destination profile', () => {
  const answers = {
    career: 'startup',
    visa: 'permanent',
    finance: 'cost',
    life: 'community',
    academic: 'pause',
    support: 'partner',
    identity: 'third'
  };
  const { ranking } = scoreEngine(answers);
  assert.equal(ranking[0], 'third');
});

test('serialize and parse answers roundtrip', () => {
  const answers = {
    career: 'startup',
    visa: 'opt',
    finance: 'skip',
    life: 'city',
    academic: 'skip',
    support: 'alumni',
    identity: 'us'
  };
  const serial = serializeAnswers(answers);
  const restored = parseAnswers(serial);
  for (const question of QUESTIONS) {
    assert.equal(restored[question.id] ?? 'skip', answers[question.id] ?? 'skip');
  }
});

test('all skip answers still produce totals', () => {
  const answers = Object.fromEntries(QUESTIONS.map((q) => [q.id, 'skip']));
  const { totals } = scoreEngine(answers);
  const sum = Object.values(totals).reduce((acc, value) => acc + value, 0);
  assert.ok(sum > 0);
  assert.ok(Math.abs(sum - 100) < 1.5, 'totals should approximate 100');
});

let hasFailure = false;
for (const { name, fn } of suite) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    hasFailure = true;
    console.error(`❌ ${name}`);
    console.error(error);
  }
}

if (hasFailure) {
  process.exitCode = 1;
} else {
  console.log(`\n全部 ${suite.length} 个断言通过。`);
}
