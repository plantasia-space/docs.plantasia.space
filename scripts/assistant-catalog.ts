import fs from 'node:fs';
import path from 'node:path';
import { buildToolList } from 'plantasia.space-orchidea/assistant';
import { createDocsRegistry } from '../src/assistant/capabilities';

const unused = (): never => { throw new Error('Catalog generation never executes tools'); };
const list = buildToolList(createDocsRegistry({ docsOrigin: 'https://docs.plantasia.space', rootOrigin: 'https://plantasia.space', page: unused, read: unused, knowledge: unused, search: unused, navigate: unused,
  studio: { route: { handoffs: { create: unused, claim: unused }, afterRequest: unused }, studioHref: unused, go: unused } }));
if (list.skipped.length || list.tools.some((tool) => tool.risk !== 'read' || !tool.label)) throw new Error('Docs tools must be strictly typed, labelled and read-only');
const catalog = JSON.stringify({ version: list.version, tools: list.tools.map(({ name, description, inputSchema, risk, label }) => ({ name, description, inputSchema, risk, label })) }, null, 2) + '\n';
const [root, flag] = process.argv.slice(2);
if (root === '--print') process.stdout.write(catalog);
else {
  if (!root || (flag !== undefined && flag !== '--check')) throw new Error('Usage: assistant:catalog <mycelium checkout> [--check] | --print');
  const target = path.resolve(root, 'config/server/ai/assistantCatalogs/docs.json');
  if (!fs.existsSync(path.dirname(target))) throw new Error('Not a Mycelium checkout');
  if (flag === '--check') { if (fs.readFileSync(target, 'utf8') !== catalog) throw new Error('Docs catalog is stale'); }
  else fs.writeFileSync(target, catalog);
}
