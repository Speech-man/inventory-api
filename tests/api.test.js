import { test } from 'node:test';
import assert from 'node:assert';

const URL = 'http://localhost:3000/resources';
const json = { 'Content-Type': 'application/json' };
let id;

async function createProduct(overrides = {}) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({
      name: 'Test Pen',
      quantity: 3,
      price: 50,
      category: 'Test',
      ...overrides,
    }),
  });
  return { res, body: await res.json() };
}

test('POST creates a product (201)', async () => {
  const { res, body } = await createProduct();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(body.success, true);
  assert.ok(body.data.id && body.data.createdAt && body.data.updatedAt);
  id = body.data.id;
});

test('POST with bad data returns 400', async () => {
  const res = await fetch(URL, { method: 'POST', headers: json, body: JSON.stringify({}) });
  assert.strictEqual(res.status, 400);
});

test('GET all returns 200 and an array', async () => {
  const res = await fetch(URL);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.data));
});

test('GET by id returns 200 and the product', async () => {
  const res = await fetch(`${URL}/${id}`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.data.id, id);
});

test('GET missing id returns 404', async () => {
  assert.strictEqual((await fetch(`${URL}/nope`)).status, 404);
});

test('PUT updates a product (200)', async () => {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT', headers: json, body: JSON.stringify({ quantity: 7 }),
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.data.quantity, 7);
});

test('PUT with bad data returns 400', async () => {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT', headers: json, body: JSON.stringify({ price: 'free' }),
  });
  assert.strictEqual(res.status, 400);
});

test('PUT on a missing id returns 404', async () => {
  const res = await fetch(`${URL}/nope`, {
    method: 'PUT', headers: json, body: JSON.stringify({ quantity: 1 }),
  });
  assert.strictEqual(res.status, 404);
});

test('low-stock list includes a low-stock product', async () => {
  const { body: created } = await createProduct({ name: 'Low Item', quantity: 2 });
  const res = await fetch(`${URL}/low-stock`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(body.data.some((p) => p.id === created.data.id));
  await fetch(`${URL}/${created.data.id}`, { method: 'DELETE' });
});

test('out-of-stock list includes a zero-quantity product', async () => {
  const { body: created } = await createProduct({ name: 'Empty Item', quantity: 0 });
  const res = await fetch(`${URL}/out-of-stock`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(body.data.some((p) => p.id === created.data.id));
  await fetch(`${URL}/${created.data.id}`, { method: 'DELETE' });
});

test('DELETE removes the product (200)', async () => {
  assert.strictEqual((await fetch(`${URL}/${id}`, { method: 'DELETE' })).status, 200);
});

test('GET after delete returns 404', async () => {
  assert.strictEqual((await fetch(`${URL}/${id}`)).status, 404);
});

test('DELETE on a missing id returns 404', async () => {
  assert.strictEqual((await fetch(`${URL}/${id}`, { method: 'DELETE' })).status, 404);
});