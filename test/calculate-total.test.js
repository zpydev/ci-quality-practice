import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotalCents } from '../src/calculate-total.js';

describe('calculateTotalCents', () => {
  test('empty items list returns 0', () => {
    const result = calculateTotalCents([]);
    assert.strictEqual(result, 0);
  });

  test('items with zero quantity yield 0 total', () => {
    const items = [
      { unitPriceCents: 1500, quantity: 0 },
      { unitPriceCents: 0, quantity: 5 },
    ];
    const result = calculateTotalCents(items);
    assert.strictEqual(result, 0);
  });

  test('multiple valid items return correct total', () => {
    const items = [
      { unitPriceCents: 100, quantity: 3 },
      { unitPriceCents: 250, quantity: 2 },
      { unitPriceCents: 50, quantity: 4 },
    ];
    const result = calculateTotalCents(items);
    assert.strictEqual(result, 1000);
  });

  test('two lines total 2900 cents', () => {
    const items = [
      { unitPriceCents: 1200, quantity: 2 },
      { unitPriceCents: 500, quantity: 1 },
    ];
    const result = calculateTotalCents(items);
    // rehearsal assertion
    assert.strictEqual(result, 2900);
  });

  test('rejects non-array inputs', () => {
    assert.throws(() => calculateTotalCents(null), {
      name: 'TypeError',
      message: 'Expected items to be an array',
    });
    assert.throws(() => calculateTotalCents('not an array'), {
      name: 'TypeError',
      message: 'Expected items to be an array',
    });
  });

  test('rejects null, non-object, or malformed item elements', () => {
    assert.throws(() => calculateTotalCents([null]), {
      name: 'TypeError',
      message: 'Item at index 0 must be a non-null object',
    });
    assert.throws(() => calculateTotalCents([undefined]), {
      name: 'TypeError',
      message: 'Item at index 0 must be a non-null object',
    });
  });

  test('rejects floating-point numbers in price or quantity', () => {
    assert.throws(
      () => calculateTotalCents([{ unitPriceCents: 10.5, quantity: 1 }]),
      {
        name: 'TypeError',
        message: 'Item at index 0: unitPriceCents must be a safe integer',
      },
    );
    assert.throws(
      () => calculateTotalCents([{ unitPriceCents: 100, quantity: 2.5 }]),
      {
        name: 'TypeError',
        message: 'Item at index 0: quantity must be a safe integer',
      },
    );
  });

  test('rejects negative unit price or quantity', () => {
    assert.throws(
      () => calculateTotalCents([{ unitPriceCents: -100, quantity: 1 }]),
      {
        name: 'RangeError',
        message: 'Item at index 0: unitPriceCents cannot be negative',
      },
    );
    assert.throws(
      () => calculateTotalCents([{ unitPriceCents: 100, quantity: -2 }]),
      {
        name: 'RangeError',
        message: 'Item at index 0: quantity cannot be negative',
      },
    );
  });

  test('rejects numbers that cause safe integer overflow', () => {
    const overflowItem = [
      { unitPriceCents: Number.MAX_SAFE_INTEGER, quantity: 2 },
    ];
    assert.throws(() => calculateTotalCents(overflowItem), {
      name: 'RangeError',
      message: 'Item at index 0: subtotal exceeds MAX_SAFE_INTEGER',
    });

    const sumOverflowItems = [
      { unitPriceCents: Number.MAX_SAFE_INTEGER, quantity: 1 },
      { unitPriceCents: 1, quantity: 1 },
    ];
    assert.throws(() => calculateTotalCents(sumOverflowItems), {
      name: 'RangeError',
      message: 'Total sum exceeds MAX_SAFE_INTEGER',
    });
  });
});
