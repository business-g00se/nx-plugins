"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = exports.copyBuildOutputToBePackaged = exports.copyAssetFilesSync = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const devkit_1 = require("@nrwl/devkit");
function copyAssetFiles(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        devkit_1.logger.info('Copying asset files...');
        try {
            yield Promise.all(options.assetFiles.map((file) => fs_extra_1.copy(file.input, file.output)));
            devkit_1.logger.info('Done copying asset files.');
            return {
                success: true,
            };
        }
        catch (err) {
            return {
                error: err.message,
                success: false,
            };
        }
    });
}
exports.default = copyAssetFiles;
function copyAssetFilesSync(options) {
    devkit_1.logger.info('Copying asset files...');
    try {
        // options.assetFiles.map(file => copy(file.input, file.output))
        options.assetFiles.forEach((file) => {
            fs_extra_1.copy(file.input, file.output);
        });
        devkit_1.logger.info('Done copying asset files.');
        return {
            success: true,
        };
    }
    catch (err) {
        return {
            error: err.message,
            success: false,
        };
    }
}
exports.copyAssetFilesSync = copyAssetFilesSync;
function copyBuildOutputToBePackaged(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        devkit_1.logger.info(`Copying build output files from ${options.package} to ${options.serverlessPackagePath} to be packaged`);
        try {
            yield fs_extra_1.remove(options.serverlessPackagePath); // remove old build output files (Support macOS issue)
            yield fs_extra_1.copy(options.package, options.serverlessPackagePath);
            devkit_1.logger.info('Done copying build output files.');
            return {
                success: true,
            };
        }
        catch (err) {
            return {
                error: err.message,
                success: false,
            };
        }
    });
}
exports.copyBuildOutputToBePackaged = copyBuildOutputToBePackaged;
const propKeys = [
    'buildTarget',
    'package',
    'list',
    'packager',
    'waitUntilTargets',
    'function',
    'ignoreScripts',
    'serverlessPackagePath',
    'root',
];
function parseArgs(options) {
    const args = options.args;
    if (!args || args.length == 0) {
        const unknownOptionsTreatedAsArgs = Object.keys(options)
            .filter((p) => propKeys.indexOf(p) === -1)
            .reduce((m, c) => ((m[c] = options[c]), m), {});
        return unknownOptionsTreatedAsArgs;
    }
    return args
        .split(' ')
        .map((t) => t.trim())
        .reduce((m, c) => {
        if (!c.startsWith('--')) {
            throw new Error(`Invalid args: ${args}`);
        }
        const [key, value] = c.substring(2).split('=');
        if (!key || !value) {
            throw new Error(`Invalid args: ${args}`);
        }
        m[key] = value;
        return m;
    }, {});
}
exports.parseArgs = parseArgs;
//# sourceMappingURL=copy-asset-files.js.map