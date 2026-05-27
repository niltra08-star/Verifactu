const fs = require('fs');
const path = require('path');

const BASE = 'C:\\Users\\navas\\Desktop\\.opencode\\facturaia';
const BASE_URL = 'https://facturaia.app';

function getAllHtmlFiles(dir, exclude = []) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (exclude.includes(item)) continue;
      results.push(...getAllHtmlFiles(full, exclude));
    } else if (item.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

function getUrlPath(filePath) {
  let rel = path.relative(BASE, filePath).replace(/\\/g, '/');
  
  // Map programmatic files to their proper URL paths
  if (rel.startsWith('autonomo/')) {
    return rel.replace('.html', ''); // /autonomo/madrid (clean URL)
  }
  if (rel.startsWith('plantillas/')) {
    return rel.replace('.html', ''); // /plantillas/factura-servicios
  }
  
  // For root and blog files, use .html extension
  if (rel === 'index.html') return '/';
  return '/' + rel; // /blog/guia-verifactu-2027.html
}

function getTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/<title>(.*?)<\/title>/);
    if (match) {
      let title = match[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      return title;
    }
  } catch (e) {}
  // fallback: extract from filename
  return path.basename(filePath, '.html').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getPriority(filePath) {
  const rel = path.relative(BASE, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '1.0';
  if (rel.startsWith('blog/') || rel.startsWith('vs/')) return '0.8';
  if (rel.startsWith('autonomo/') || rel.startsWith('plantillas/')) return '0.5';
  if (rel.endsWith('aviso-legal.html') || rel.endsWith('privacidad.html') || rel.endsWith('terminos.html')) return '0.3';
  return '0.7';
}

function getChangefreq(filePath) {
  const rel = path.relative(BASE, filePath).replace(/\\/g, '/');
  if (rel === 'index.html' || rel === 'blog/index.html') return 'weekly';
  if (rel.startsWith('autonomo/') || rel.startsWith('plantillas/')) return 'monthly';
  if (rel.endsWith('aviso-legal.html') || rel.endsWith('privacidad.html') || rel.endsWith('terminos.html')) return 'yearly';
  return 'monthly';
}

// Get all HTML files
const allFiles = getAllHtmlFiles(BASE, ['node_modules', 'backend', 'frontend', '.vercel', '.git']);
console.log(`Found ${allFiles.length} HTML files`);

// Generate sitemap entries
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
<!-- Generated: ${new Date().toISOString().split('T')[0]} -->
<!-- Total URLs: ${allFiles.length} -->
`;

for (const filePath of allFiles) {
  const url = getUrlPath(filePath);
  const priority = getPriority(filePath);
  const changefreq = getChangefreq(filePath);
  const lastmod = new Date().toISOString().split('T')[0];
  
  sitemap += `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
}

sitemap += `</urlset>`;

const sitemapPath = path.join(BASE, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`Sitemap written to ${sitemapPath}`);
console.log(`Total URLs: ${allFiles.length}`);

// Count by category
let stats = { root: 0, blog: 0, autonomo: 0, plantillas: 0, vs: 0, herramientas: 0, other: 0 };
for (const f of allFiles) {
  const rel = path.relative(BASE, f).replace(/\\/g, '/');
  if (rel.startsWith('blog/') || rel === 'blog/index.html') stats.blog++;
  else if (rel.startsWith('autonomo/')) stats.autonomo++;
  else if (rel.startsWith('plantillas/')) stats.plantillas++;
  else if (rel.startsWith('vs/')) stats.vs++;
  else if (rel.startsWith('herramientas/')) stats.herramientas++;
  else if (!rel.includes('/')) stats.root++;
  else stats.other++;
}
console.log('\nURLs by category:');
console.log(`  Root pages: ${stats.root}`);
console.log(`  Blog: ${stats.blog}`);
console.log(`  Autonomo (province + profession): ${stats.autonomo}`);
console.log(`  Plantillas (invoice templates): ${stats.plantillas}`);
console.log(`  Comparison (vs): ${stats.vs}`);
console.log(`  Herramientas: ${stats.herramientas}`);
console.log(`  Total: ${allFiles.length}`);
