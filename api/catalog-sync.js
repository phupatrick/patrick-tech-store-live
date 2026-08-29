import { getCatalogProducts } from './_lib/zalo.js';

export default async function handler(request, response) {
  const syncSecret = process.env.CRON_SECRET || process.env.CATALOG_SYNC_SECRET;
  const authHeader = request.headers.authorization || request.query?.secret;
  const isVercelCron = String(request.headers['user-agent'] || '').toLowerCase().includes('vercel-cron');
  const isValidSecret = Boolean(syncSecret && (authHeader === `Bearer ${syncSecret}` || authHeader === syncSecret));

  if (process.env.NODE_ENV === 'production' && !isVercelCron && !isValidSecret) {
    return response.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  try {
    const data = await getCatalogProducts();

    response.status(200).json({
      ok: true,
      total: data.total,
      syncedAt: data.syncedAt
    });
  } catch (error) {
    response.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
