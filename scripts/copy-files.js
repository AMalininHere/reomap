const fse = require('fs-extra');
const path = require('path');

const cwd = process.cwd();

async function copyPackageJson(fromFile, toFile) {
  const packageJsonData = await fse.readFile(fromFile, 'utf8');
  const sourcePackageJson = JSON.parse(packageJsonData);

  const destPackageJson = {
    ...sourcePackageJson,
  };

  destPackageJson.scripts = undefined;
  destPackageJson.typings = './index.d.ts';

  await fse.writeFile(toFile, JSON.stringify(destPackageJson, null, 2));

  console.log('"package.json" was copied to "/build"');
}

async function main() {
  const sourcePackageJsonPath = path.join(cwd, 'package.json');
  const destPackageJsonPath = path.join(cwd, 'build', 'package.json');
  await copyPackageJson(sourcePackageJsonPath, destPackageJsonPath);
}

main().catch(err => console.error(err));
