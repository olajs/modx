const path = require('path');
const rimraf = require('rimraf');
const { spawnSync } = require('child_process');

rimraf.sync(path.resolve(__dirname, '../lib'));

const cwd = path.join(__dirname, '..');

const result = spawnSync(
  './node_modules/.bin/babel',
  ['src', '--out-dir', 'lib', '--extensions', '.ts,.tsx'],
  {
    cwd,
    stdio: 'inherit',
  },
);

if (result.status !== 0 || result.error) {
  result.error && console.error(result.error);
  process.exit(1);
}

spawnSync('tsc', ['--emitDeclarationOnly'], { cwd, stdio: 'inherit' });
