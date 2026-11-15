import { test } from 'node:test';
import assert from 'node:assert';
import { validateCreate, validateUpdate } from '../middleware/validate.js';

function run(middleware, body) {
  const result = { status: null, nextCalled: false };
  const res = {
    status(code) { result.status = code; return this; },
    json() { return this; },
  };
  middleware({ body }, res, () => { result.nextCalled = true; });
  return result;
}

const good = { name: 'Pen', quantity: 10, price: 50, category: 'Stationery' };

test('valid product passes', () => {
  assert.strictEqual(run(validateCreate, good).nextCalled, true);
});
test('empty body is rejected with 400', () => {
  assert.strictEqual(run(validateCreate, {}).status, 400);
});
test('missing name is rejected', () => {
  const { name, ...noName } = good;
  assert.strictEqual(run(validateCreate, noName).status, 400);
});
test('quantity as text is rejected', () => {
  assert.strictEqual(run(validateCreate, { ...good, quantity: 'ten' }).status, 400);
});
test('negative price is rejected', () => {
  assert.strictEqual(run(validateCreate, { ...good, price: -5 }).status, 400);
});
test('update allows a single field', () => {
  assert.strictEqual(run(validateUpdate, { quantity: 4 }).nextCalled, true);
});
test('update rejects an invalid field', () => {
  assert.strictEqual(run(validateUpdate, { price: 'free' }).status, 400);
});