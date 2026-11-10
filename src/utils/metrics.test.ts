import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCTR,
  calculateCVR,
  calculateCPA,
  calculateCPC,
  calculateROAS,
  calculateAllMetrics,
  getPlatformLimit,
} from './metrics';
import { exportToCSV, parseCSV } from './csv';

test('CTR calculates correctly with non-zero impressions', () => {
  assert.equal(calculateCTR(50, 1000), 5.0);
  assert.equal(calculateCTR(12, 345), 3.48);
});

test('CTR handles zero, negative and null impressions safely', () => {
  assert.equal(calculateCTR(50, 0), 0);
  assert.equal(calculateCTR(50, -10), 0);
  assert.equal(calculateCTR(null, 1000), 0);
  assert.equal(calculateCTR(undefined, undefined), 0);
});

test('CVR calculates conversion rate safely', () => {
  assert.equal(calculateCVR(10, 100), 10.0);
  assert.equal(calculateCVR(0, 100), 0);
  assert.equal(calculateCVR(10, 0), 0);
});

test('CPA calculates cost per acquisition safely', () => {
  assert.equal(calculateCPA(1000, 20), 50.0);
  assert.equal(calculateCPA(1000, 0), 0); // No division by zero error
  assert.equal(calculateCPA(0, 20), 0);
});

test('ROAS calculates return on ad spend safely', () => {
  assert.equal(calculateROAS(4500, 1000), 4.5);
  assert.equal(calculateROAS(0, 1000), 0);
  assert.equal(calculateROAS(1000, 0), 0);
});

test('calculateAllMetrics produces complete safe metric set', () => {
  const result = calculateAllMetrics({
    spend: 2000,
    impressions: 40000,
    clicks: 1200,
    conversions: 60,
    leads: 120,
    revenue: 8000,
  });

  assert.equal(result.ctr, 3.0);
  assert.equal(result.cvr, 5.0);
  assert.equal(result.cpc, 1.67);
  assert.equal(result.cpa, 33.33);
  assert.equal(result.roas, 4.0);
  assert.equal(result.cpl, 16.67);
  assert.equal(result.profit, 6000.0);
});

test('Platform limits return correct character caps', () => {
  assert.equal(getPlatformLimit('x'), 280);
  assert.equal(getPlatformLimit('Instagram'), 2200);
  assert.equal(getPlatformLimit('linkedin'), 3000);
  assert.equal(getPlatformLimit('pinterest'), 500);
});

test('CSV export and parsing round-trips data accurately', () => {
  const sample = [
    { campaign: 'Summer Sale', spend: '1500', conversions: '45' },
    { campaign: 'Brand Awareness', spend: '500', conversions: '10' },
  ];

  const csv = exportToCSV(sample);
  assert.ok(csv.includes('"Summer Sale"'));
  assert.ok(csv.includes('"campaign","spend","conversions"'));

  const parsed = parseCSV(csv);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].campaign, 'Summer Sale');
  assert.equal(parsed[0].spend, '1500');
  assert.equal(parsed[1].campaign, 'Brand Awareness');
});
