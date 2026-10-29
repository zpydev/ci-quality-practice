import { spawnSync } from 'node:child_process';
import process from 'node:process';

/**
 * 极简源码语法检查工具。
 * 仅调用 Node 原生内置命令 `node --check` 检查固定的 3 个源码文件语法。
 * 说明：此脚本仅验证 ECMAScript 语法正确性，不进行全量代码风格（Linting）或静态类型推断。
 */
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
