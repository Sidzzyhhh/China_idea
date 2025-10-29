import assert from 'node:assert/strict';
import {
  calculateScores,
  normalizeSliderValue,
  regressionMatrix,
  rankPaths,
} from '../scripts/scoring.js';

function approxEqual(a, b, epsilon = 1e-6) {
  return Math.abs(a - b) < epsilon;
}

// Test 1: zero priorities should return zero scores
{
  const zeroPriorities = {
    careerMomentum: 0,
    visaCertainty: 0,
    fundingOutlook: 0,
    financialSafety: 0,
    communitySupport: 0,
    globalMobility: 0,
  };
  const { raw, normalized } = calculateScores(zeroPriorities, regressionMatrix);
  Object.values(raw).forEach((value) => assert.ok(approxEqual(value, 0)));
  Object.values(normalized).forEach((value) => assert.equal(value, 0));
}

// Test 2: prioritizing签证 should push returnCN to top
{
  const priorities = {
    careerMomentum: 0.1,
    visaCertainty: 1,
    fundingOutlook: 0.2,
    financialSafety: 0.2,
    communitySupport: 0.2,
    globalMobility: 0.1,
  };
  const { normalized } = calculateScores(priorities, regressionMatrix);
  const ranking = rankPaths(normalized);
  assert.equal(ranking[0], 'returnCN');
}

// Test 3: prioritizing global mobility should elevate exploreGlobal
{
  const priorities = {
    careerMomentum: 0.2,
    visaCertainty: 0.1,
    fundingOutlook: 0.2,
    financialSafety: 0.2,
    communitySupport: 0.1,
    globalMobility: 1,
  };
  const { normalized } = calculateScores(priorities, regressionMatrix);
  const ranking = rankPaths(normalized);
  assert.equal(ranking[0], 'exploreGlobal');
}

// Test 4: normalize slider utility should clamp values correctly
{
  assert.equal(normalizeSliderValue(10), 1);
  assert.ok(approxEqual(normalizeSliderValue(5), 0.5));
  assert.equal(normalizeSliderValue(-4), 0);
  assert.equal(normalizeSliderValue(100, 0, 10), 1);
}

console.log('All scoring tests passed.');
