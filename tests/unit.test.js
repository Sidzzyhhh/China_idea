const fs = require('fs');
const path = require('path');
const assert = require('assert');

const app = require('../app.js');

function read(file) {
  return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
}

function countOccurrences(content, snippet) {
  const regex = new RegExp(snippet, 'g');
  const matches = content.match(regex);
  return matches ? matches.length : 0;
}

(function testUniqueModules() {
  const index = read('index.html');
  const quiz = read('quiz.html');
  const learn = read('learn.html');

  assert.strictEqual(countOccurrences(index, 'data-nav="main"'), 1, 'index.html 应只有一个主导航');
  assert.strictEqual(countOccurrences(quiz, 'data-nav="main"'), 1, 'quiz.html 应只有一个主导航');
  assert.strictEqual(countOccurrences(learn, 'data-nav="main"'), 1, 'learn.html 应只有一个主导航');

  assert.strictEqual(countOccurrences(index, 'data-hero="main"'), 1, 'index.html 应只有一个英雄区');
  assert.strictEqual(countOccurrences(quiz, 'data-hero="main"'), 1, 'quiz.html 应只有一个英雄区');
  assert.strictEqual(countOccurrences(learn, 'data-hero="main"'), 1, 'learn.html 应只有一个英雄区');

  assert.strictEqual(countOccurrences(index, 'data-matrix="card"'), 1, 'index.html 仅允许一个矩阵示意卡');
  assert.strictEqual(countOccurrences(quiz, 'data-progress="line"'), 1, 'quiz.html 仅允许一个进度条');
  assert.strictEqual(countOccurrences(quiz, 'id="slides"'), 1, 'quiz.html 仅允许一个滑屏容器');
})();

(function testFeatureVector() {
  const sampleAnswers = {
    stage: ['bigco'],
    status: ['h1b'],
    money: ['salary'],
    life: ['pace'],
    academic: ['phd'],
    support: ['family'],
    identity: ['global']
  };

  const { vector } = app.toFeatures(sampleAnswers);
  assert.strictEqual(vector.length, app.FEATURE_LIST.length, '特征向量长度不匹配');
  const nonZero = vector.filter((value) => value > 0);
  assert.ok(nonZero.length >= 4, '特征向量应包含多个正向贡献');
})();

(function testScoreRecommendations() {
  const answersUS = {
    stage: ['bigco'],
    status: ['h1b'],
    money: ['salary'],
    life: ['pace'],
    academic: ['phd'],
    support: ['alumni'],
    identity: ['global']
  };

  const usResult = app.scoreEngine(answersUS);
  assert.strictEqual(usResult.ranking[0].key, 'us', '美国场景未被识别为首选');

  const answersCN = {
    stage: ['academic'],
    status: ['gc'],
    money: ['family'],
    life: ['community'],
    academic: ['mentor'],
    support: ['family', 'partner'],
    identity: ['home']
  };

  const cnResult = app.scoreEngine(answersCN);
  assert.strictEqual(cnResult.ranking[0].key, 'cn', '中国场景未被识别为首选');

  const answersThird = {
    stage: ['startup'],
    status: ['opt'],
    money: ['cost'],
    life: ['climate'],
    academic: ['applied'],
    support: ['alumni'],
    identity: ['hybrid']
  };

  const thirdResult = app.scoreEngine(answersThird);
  assert.strictEqual(thirdResult.ranking[0].key, 'third', '第三地场景未被识别为首选');
})();

(function testSerialization() {
  const answers = {
    stage: ['bigco'],
    status: ['opt'],
    money: ['salary'],
    life: ['community'],
    academic: ['mentor'],
    support: ['family', 'partner'],
    identity: ['home']
  };
  const encoded = app.encodeAnswers(answers);
  const decoded = app.decodeAnswers(encoded);
  assert.deepStrictEqual(decoded, answers, '序列化与反序列化不一致');
})();

(function testEmptyAnswers() {
  const result = app.scoreEngine({});
  assert.strictEqual(result.ranking.length, 3, '排名数量应为 3');
  const sum = result.totals.reduce((acc, value) => acc + value, 0);
  assert.ok(sum > 99 && sum < 101, '归一化结果应约等于 100');
})();

console.log('✓ unit tests passed');
