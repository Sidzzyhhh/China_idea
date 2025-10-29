import fs from 'fs';
import path from 'path';
import assert from 'assert';

const ROOT = process.cwd();
const bannedPattern = /\.(png|jpe?g|gif|webp|ico|icns|pdf|woff2?|ttf|otf|eot)$/i;
const ignoredDirs = new Set(['node_modules', '.git']);
const offenders = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (bannedPattern.test(entry.name)) {
      offenders.push(fullPath.replace(`${ROOT}${path.sep}`, ''));
    }
  }
}

walk(ROOT);
assert.strictEqual(
  offenders.length,
  0,
  `Found banned binary files:\n${offenders.join('\n')}`.trim()
);
console.log('✓ no-binary check passed');
