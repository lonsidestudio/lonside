/**
 * Soumet instantanément toutes les URLs canoniques de https://www.lonside.com/sitemap.xml
 * à l'API IndexNow (Bing, ChatGPT Search, Yandex, Seznam, Naver).
 *
 * Usage (après déploiement en production) :
 *   npm run seo:indexnow
 */

const SITE_HOST = 'www.lonside.com';
const SITE_URL = `https://${SITE_HOST}`;
const INDEXNOW_KEY = 'f4a8c2e19b7d4036a5e8c1b9d2f7460a';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

async function main() {
  // 1. Vérifier que la clé IndexNow est bien accessible en production (200 OK)
  const keyRes = await fetch(KEY_LOCATION);
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || keyBody !== INDEXNOW_KEY) {
    console.error(
      `[IndexNow] Clé introuvable ou invalide sur ${KEY_LOCATION} (HTTP ${keyRes.status}). Déployez d'abord sur main avant de lancer la soumission.`
    );
    process.exit(1);
  }

  // 2. Extraire toutes les URLs canoniques du sitemap.xml en production
  const sitemapRes = await fetch(SITEMAP_URL);
  if (!sitemapRes.ok) {
    console.error(`[IndexNow] Impossible de lire ${SITEMAP_URL} (HTTP ${sitemapRes.status}).`);
    process.exit(1);
  }

  const sitemapXml = await sitemapRes.text();
  const urlList = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1].trim());

  if (urlList.length === 0) {
    console.error('[IndexNow] Aucune URL trouvée dans sitemap.xml.');
    process.exit(1);
  }

  // 3. Soumettre le lot complet à api.indexnow.org (fan-out automatique vers Bing / ChatGPT Search)
  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const submitRes = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (submitRes.status === 200 || submitRes.status === 202) {
    console.log(
      `[IndexNow] Succès (HTTP ${submitRes.status}) — ${urlList.length} URLs soumises instantanément à Bing / IndexNow.`
    );
    return;
  }

  const errText = await submitRes.text();
  console.error(`[IndexNow] Échec de soumission (HTTP ${submitRes.status}) : ${errText}`);
  process.exit(1);
}

main().catch((err) => {
  console.error('[IndexNow] Erreur inattendue :', err);
  process.exit(1);
});
