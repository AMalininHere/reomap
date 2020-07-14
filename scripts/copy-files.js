const fse = require('fs-extra');
const path = require('path');

const cwd = process.cwd();

async function createPackageJson(fromFile, toFile) {
  const packageJsonData = await fse.readFile(fromFile, 'utf8');
  const sourcePackageJson = JSON.parse(packageJsonData);

  const destPackageJson = {
    ...sourcePackageJson,
    scripts: undefined,
    typings: './index.d.ts',
    module: './esm5/index.js',
  };

  await fse.writeFile(toFile, JSON.stringify(destPackageJson, null, 2));

  console.log('"package.json" was copied to "/build"');
}

async function createModulePackages(buildDir, dirs) {
  await Promise.all(dirs.map(async dir => {
    const packageData = {
      typings: './index.d.ts',
      module: path.join('..', 'esm5', dir, 'index.js')
    };

    await fse.writeFile(path.join(cwd, buildDir, dir, 'package.json'), JSON.stringify(packageData, null, 2));
  }));
}

async function main() {
  const sourcePackageJsonPath = path.join(cwd, 'package.json');
  const destPackageJsonPath = path.join(cwd, 'build', 'package.json');
  await createPackageJson(sourcePackageJsonPath, destPackageJsonPath);
  await createModulePackages('build', [ 'svg' ])
}

main().catch(err => console.error(err));
