const fs = require('fs');
const path = require('path');

function copyPackageJson(fromFile, toFile) {
  const sourcePackageJson = JSON.parse(fs.readFileSync(fromFile).toString());

  const destPackageJson = {
    ...sourcePackageJson,
  };

  destPackageJson.scripts = undefined;

  fs.writeFileSync(toFile, JSON.stringify(destPackageJson, null, 2));

  console.log('"package.json" was copied to "/build"');
}

function copyLicense(params) {

}

function main() {
  const cwd = process.cwd();
  const sourcePackageJsonPath = path.join(cwd, 'package.json');
  const destPackageJsonPath = path.join(cwd, 'build', 'package.json');
  copyPackageJson(sourcePackageJsonPath, destPackageJsonPath);
}

main();
