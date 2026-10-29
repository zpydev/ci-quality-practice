import { spawnSync } from 'node:child_process';
import process from 'node:process';

const filesToCheck = [
  'src/calculate-total.js',
  'test/calculate-total.test.js',
  'scripts/check-syntax.mjs',
];

let hasError = false;

console.log('Running syntax verification (node --check)...');

for (const file of filesToCheck) {
  const result = spawnSync(process.execPath, ['--check', file], {
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    console.error(`Syntax check failed for: ${file}`);
    hasError = true;
  } else {
    console.log(`OK: ${file}`);
  }
}

if (hasError) {
  console.error('\nSyntax verification failed.');
  process.exit(1);
}

console.log('\nAll checked files passed syntax verification.');
process.exit(0);
