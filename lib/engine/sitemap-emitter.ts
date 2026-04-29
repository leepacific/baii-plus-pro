import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
export const SITEMAP = {
  project: 'ba2-pro',
  brief_hash: 'd3e500237483a7072e3be2b720122261d327b8638a0f5e5db69d495d206380b6',
  base_url: 'http://localhost:3000',
  subdomains: [],
  routes: [{ path: '/', page_id: 'PAGE-001', purpose: 'BA II Plus Professional calculator replica', req_ids: ['REQ-001','REQ-029'], data_dependencies: [], states: ['default','empty','loading','error','success'] }],
  api_endpoints: []
} as const;
export const emitSitemap = (outPath = resolve(process.cwd(), '../handoffs/sitemap.yaml')): void => {
  const yaml = `project: ${SITEMAP.project}\nbrief_hash: ${SITEMAP.brief_hash}\nbase_url: ${SITEMAP.base_url}\nsubdomains: []\nroutes:\n  - path: /\n    page_id: PAGE-001\n    purpose: BA II Plus Professional calculator replica\n    req_ids:\n      - REQ-001\n      - REQ-029\n    data_dependencies: []\n    states:\n      - default\n      - empty\n      - loading\n      - error\n      - success\napi_endpoints: []\n`;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, yaml);
};
if (process.argv[1]?.endsWith('sitemap-emitter.ts')) emitSitemap();
