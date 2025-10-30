const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { QUESTIONS, toFeatures, scoreEngine, encodeAnswers, decodeAnswers, ROUTES } = require('../app.js');

describe('结构唯一性', () => {
  const fixtures = [
    {
      file: 'index.html',
      checks: [
        { pattern: /data-nav="main"/g, expected: 1, message: '首页必须只有一个主导航' },
        { pattern: /data-hero="main"/g, expected: 1, message: '首页必须只有一个英雄区' },
        { pattern: /data-matrix="card"/g, expected: 1, message: '首页只能有一张矩阵示意卡' }
      ]
    },
    {
      file: 'quiz.html',
      checks: [
        { pattern: /data-nav="main"/g, expected: 1, message: '问答页必须只有一个主导航' },
        { pattern: /data-hero="main"/g, expected: 1, message: '问答页必须只有一个英雄区' },
        { pattern: /data-progress="line"/g, expected: 1, message: '问答页进度条只能存在一次' },
        { pattern: /id="slides"/g, expected: 1, message: '问答页只允许一个滑屏容器' }
      ]
    },
    {
      file: 'learn.html',
      checks: [
        { pattern: /data-nav="main"/g, expected: 1, message: '资讯页必须只有一个主导航' },
        { pattern: /data-hero="main"/g, expected: 1, message: '资讯页必须只有一个英雄区' }
      ]
    }
  ];

  fixtures.forEach(({ file, checks }) => {
    const contents = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    checks.forEach(({ pattern, expected, message }) => {
      const matches = contents.match(pattern) || [];
      assert.strictEqual(matches.length, expected, `${message}（${file}）`);
    });
  });
});

describe('特征映射与评分', () => {
  it('toFeatures 应返回与题目数量匹配的向量', () => {
    const answerIds = QUESTIONS.map((question) => question.options[0].id);
    const { vector } = toFeatures(answerIds);
    assert.strictEqual(vector.length, QUESTIONS.length * ROUTES.length, '向量长度应为题目数乘以路线数');
    const positive = vector.filter((value) => value > 0.5).length;
    assert.ok(positive >= QUESTIONS.length, '至少每题产生一个显著特征');
  });

  it('美国倾向的组合应推荐美国', () => {
    const answers = [
      'career_bigtech',
      'status_h1b',
      'finance_salary',
      'lifestyle_city',
      'academic_phd',
      'support_partner',
      'identity_us'
    ];
    const result = scoreEngine(answers);
    assert.strictEqual(result.ranking[0].route, 'US');
    assert.ok(result.totals[0] > result.totals[1]);
  });

  it('回国倾向的组合应推荐中国', () => {
    const answers = [
      'career_academic',
      'status_green',
      'finance_cost',
      'lifestyle_community',
      'academic_mentor',
      'support_family',
      'identity_cn'
    ];
    const result = scoreEngine(answers);
    assert.strictEqual(result.ranking[0].route, 'CN');
  });

  it('第三地倾向的组合应推荐第三地', () => {
    const answers = [
      'career_startup',
      'status_opt',
      'finance_cost',
      'lifestyle_climate',
      'academic_shift',
      'support_network',
      'identity_global'
    ];
    const result = scoreEngine(answers);
    assert.strictEqual(result.ranking[0].route, 'THIRD');
  });

  it('空答案仍可给出排名且总和约等于 100', () => {
    const answers = new Array(QUESTIONS.length).fill(null);
    const result = scoreEngine(answers);
    assert.strictEqual(result.ranking.length, 3);
    const total = result.totals.reduce((sum, value) => sum + value, 0);
    assert.ok(Math.abs(total - 100) < 1, '总分应在 100 附近');
  });
});

describe('分享链接序列化', () => {
  it('encodeAnswers 与 decodeAnswers 应该互逆', () => {
    const sample = [
      'career_bigtech',
      'status_h1b',
      null,
      'lifestyle_city',
      'academic_phd',
      'support_partner',
      'identity_us'
    ];
    const token = encodeAnswers(sample);
    const decoded = decodeAnswers(token);
    assert.deepStrictEqual(decoded, sample);
  });

  it('非法 token 应返回 null', () => {
    assert.strictEqual(decodeAnswers('@@'), null);
  });
});

// 轻量 describe/it 实现，避免依赖外部测试框架
function describe(name, fn) {
  try {
    fn();
    console.log(`\n${name}`);
  } catch (error) {
    console.error(`\n${name} 失败`, error);
    process.exitCode = 1;
  }
}

function it(title, fn) {
  try {
    fn();
    console.log(`  ✓ ${title}`);
  } catch (error) {
    console.error(`  ✗ ${title}`);
    console.error(error);
    process.exitCode = 1;
  }
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
