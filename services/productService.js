import { randomUUID } from 'crypto';
import { readProducts, writeProducts } from '../data/storage.js';

const DEFAULT_THRESHOLD = 5;

export async function getAllProducts() {
  return readProducts();
}

export async function getProductById(id) {
  const products = await readProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function createProduct(data) {
  const products = await readProducts();
  const now = new Date().toISOString();
  const product = {
    id: randomUUID(),
    name: data.name,
    quantity: data.quantity,
    price: data.price,
    category: data.category,
    lowStockThreshold: data.lowStockThreshold ?? DEFAULT_THRESHOLD,
    createdAt: now,
    updatedAt: now,
  };
  products.push(product);
  await writeProducts(products);
  return product;
}

export async function updateProduct(id, data) {
  const products = await readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = {
    ...products[index],
    ...data,
    id: products[index].id,
    createdAt: products[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  await writeProducts(products);
  return products[index];
}

export async function deleteProduct(id) {
  const products = await readProducts();
  const remaining = products.filter((p) => p.id !== id);
  if (remaining.length === products.length) return false;
  await writeProducts(remaining);
  return true;
}

export async function getLowStockProducts() {
  const products = await readProducts();
  return products.filter(
    (p) => p.quantity > 0 && p.quantity <= (p.lowStockThreshold ?? DEFAULT_THRESHOLD)
  );
}

export async function getOutOfStockProducts() {
  const products = await readProducts();
  return products.filter((p) => p.quantity === 0);
}