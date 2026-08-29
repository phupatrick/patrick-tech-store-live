const CATALOG_API = 'https://api-catalog.zalo.me';
const PAGE_SIZE = 20;
const CATALOGS = [
  { id: 'CjB4IZYLbGb1hBDIEvNfUJUdmLPRuE0S9DUwEItYd6PUrhOpKvEJ7m', labelVi: 'Tài khoản Premium', labelEn: 'Premium Accounts', category: 'premium' },
  { id: 'CjN8JpoKdmn5hRbNFvJZV3EcorDVuUeP8DQmF2dZbcDQrxmsLvAP6W', labelVi: 'API Key & AI', labelEn: 'API Keys & AI', category: 'ai' },
  { id: 'CjN8J3-Id0z6gxfKF9BWVp2Wo51Sv-aQ8z2pFohbbM1PqRyrL9IQ6G', labelVi: 'Mạng xã hội', labelEn: 'Social Growth', category: 'social' },
  { id: 'CjN8J3-IdGz6gxjKF9BXVp2WoL1Sv-WQ8z2oFohbb61PqRurL9IR6G', labelVi: 'Code, Tool & Phần mềm', labelEn: 'Code, Tools & Software', category: 'software' }
];

function parsePrice(value, fallback = 0) {
  if (typeof value === 'number' && value > 0) return value;
  if (!value || typeof value !== 'string') return fallback;
  const digits = value.replace(/[^\d]/g, '');
  return digits ? Number(digits) : fallback;
}

function inferBadge(priceText = '', index = 0) {
  if (/hết|ngưng/i.test(priceText)) return 'Tạm dừng';
  return ['Đã xác thực', 'Đáng tin cậy', 'Hàng nội bộ'][index % 3];
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json, text/plain, */*', 'user-agent': 'patrick-tech-store/1.0' } });
  if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { accept: 'text/html,application/xhtml+xml', 'user-agent': 'patrick-tech-store/1.0' } });
  if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  return response.text();
}

function extractMetaContent(html, property) {
  const safe = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const pattern of [
    new RegExp(`<meta[^>]+property=["']${safe}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${safe}["']`, 'i')
  ]) {
    const match = html?.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return '';
}

async function fetchCatalogPage(catalog, lastId = 0) {
  return fetchJson(`${CATALOG_API}/v1/catalog?noise=${encodeURIComponent(catalog.id)}&limit=${PAGE_SIZE}&lastId=${lastId}`);
}

function productPid(path) {
  if (!path) return '';
  const query = path.includes('?') ? path.slice(path.indexOf('?') + 1) : path;
  return new URLSearchParams(query).get('pid') || '';
}

async function fetchProductDetail(productPath) {
  const pid = productPid(productPath);
  return pid ? fetchJson(`${CATALOG_API}/v1/product?productId=${encodeURIComponent(pid)}`) : null;
}

async function fetchProductMeta(path) {
  if (!path) return {};
  try {
    const url = path.startsWith('http') ? path : `https://catalog.zalo.me/${path.replace(/^\/?/, '')}`;
    const html = await fetchText(url);
    return { title: extractMetaContent(html, 'og:title'), description: extractMetaContent(html, 'og:description'), image: extractMetaContent(html, 'og:image') };
  } catch {
    return {};
  }
}

async function mapWithConcurrency(items, mapper, concurrency = 5) {
  const results = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await mapper(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

async function fetchCatalogProducts(catalog) {
  const rows = [];
  const seenIds = new Set();
  let lastId = 0;
  let total = Infinity;
  while (rows.length < total) {
    const page = await fetchCatalogPage(catalog, lastId);
    const pageRows = page?.data?.category_product ?? [];
    total = page?.data?.total ?? pageRows.length;
    if (!pageRows.length) break;
    for (const row of pageRows) {
      if (row.id && !seenIds.has(row.id)) {
        seenIds.add(row.id);
        rows.push(row);
      }
    }
    const ids = pageRows.map((row) => row.id).filter(Boolean);
    const nextLastId = ids.length ? Math.min(...ids) : 0;
    if (!nextLastId || nextLastId === lastId) break;
    lastId = nextLastId;
  }
  return mapWithConcurrency(rows, async (product, index) => {
    const [detailResponse, meta] = await Promise.all([fetchProductDetail(product.path).catch(() => null), fetchProductMeta(product.path)]);
    const info = detailResponse?.data?.product_info ?? {};
    const price = parsePrice(product.strPrice, product.price);
    return {
      id: `${catalog.id}:${product.id}`,
      catalogId: catalog.id,
      catalogLabelVi: catalog.labelVi,
      catalogLabelEn: catalog.labelEn,
      catalogCategory: catalog.category,
      title: meta.title || product.name,
      price,
      priceText: product.strPrice || (price ? `${price.toLocaleString('vi-VN')}đ` : 'Liên hệ'),
      image: product.photos?.[0] || meta.image || 'https://stc-zh5.zdn.vn/catalog/thumb-fail.png',
      images: info.productPhotos || product.photos || [],
      badge: inferBadge(product.strPrice, index),
      path: `https://catalog.zalo.me/${product.path}`,
      source: 'zalo-catalog',
      sellerName: info.ownerDisplayName || 'Patrick Tech Media',
      sellerAvatar: info.ownerAvatarUrl || '',
      description: info.description || meta.description || '',
      rawPrice: product.price,
      syncedAt: new Date().toISOString()
    };
  });
}

function dedupeProducts(products) {
  const seen = new Set();
  return products.filter((product) => {
    const key = `${product.title?.trim().toLowerCase()}|${product.price}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getCatalogProducts() {
  const results = await Promise.allSettled(CATALOGS.map(fetchCatalogProducts));
  const products = dedupeProducts(results.flatMap((result) => result.status === 'fulfilled' ? result.value : []));
  const errors = results.flatMap((result, index) => result.status === 'rejected' ? [{ catalogId: CATALOGS[index].id, catalogLabel: CATALOGS[index].labelVi, message: result.reason?.message || 'Catalog unavailable' }] : []);
  if (!products.length && errors.length === CATALOGS.length) throw new Error('All Zalo catalogs are unavailable');
  return {
    source: 'https://catalog.zalo.me/',
    catalogName: 'Tất cả sản phẩm',
    catalogs: CATALOGS.map(({ id, labelVi, labelEn, category }) => ({ id, labelVi, labelEn, category })),
    errors,
    total: products.length,
    syncedAt: new Date().toISOString(),
    products
  };
}
