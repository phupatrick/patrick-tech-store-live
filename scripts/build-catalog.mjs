// Fetch Zalo catalog products at build time and write a static catalog.json.
// GitHub Pages is static-only, so the client reads this pre-built file instead of /api/products.
import { writeFile } from 'node:fs/promises';
import { getCatalogProducts } from '../api/_lib/zalo.js';

const OUT = new URL('../public/catalog.json', import.meta.url);

try {
  const data = await getCatalogProducts();
  const payload = {
    source: data.source,
    catalogName: data.catalogName,
    catalogs: data.catalogs,
    errors: data.errors,
    total: data.total,
    syncedAt: data.syncedAt,
    products: data.products,
  };
  await writeFile(OUT, JSON.stringify(payload), 'utf8');
  console.log(`catalog.json written: ${payload.total} products, ${payload.errors.length} catalog errors`);
} catch (error) {
  // Do not fail the deploy: keep any previously committed catalog.json and let the UI show fallback.
  console.error('catalog build failed:', error?.message || error);
  process.exit(0);
}
