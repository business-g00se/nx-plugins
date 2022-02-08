"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNxPackage = exports.readNxVersion = void 0;
const devkit_1 = require("@nrwl/devkit");
function readNxVersion(tree) {
    const packageJson = devkit_1.readJson(tree, 'package.json');
    const nxVersion = packageJson.devDependencies['@nrwl/workspace']
        ? packageJson.devDependencies['@nrwl/workspace']
        : packageJson.dependencies['@nrwl/workspace'];
    if (!nxVersion) {
        throw new Error('@nrwl/workspace is not a dependency.');
    }
    return nxVersion;
}
exports.readNxVersion = readNxVersion;
function hasNxPackage(tree, nxPackage) {
    const packageJson = devkit_1.readJson(tree, 'package.json');
    return ((packageJson.dependencies && packageJson.dependencies[nxPackage]) ||
        (packageJson.devDependencies && packageJson.devDependencies[nxPackage]));
}
exports.hasNxPackage = hasNxPackage;
//# sourceMappingURL=util.js.map