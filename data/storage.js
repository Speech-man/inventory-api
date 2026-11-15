import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'products.json');

export async function readProducts() {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeProducts(products) {
  await fs.writeFile(FILE, JSON.stringify(products, null, 2));
}