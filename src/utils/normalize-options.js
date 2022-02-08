"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const path_1 = require("path");
function normalizeAssetOptions(options, context) {
    const outDir = options.outputPath;
    const files = [];
    const globbedFiles = (pattern, input = '', ignore = []) => {
        return glob.sync(pattern, {
            cwd: input,
            nodir: true,
            ignore,
        });
    };
    options.assets.forEach((asset) => {
        if (typeof asset === 'string') {
            globbedFiles(asset, context.root).forEach((globbedFile) => {
                files.push({
                    input: path_1.join(context.root, globbedFile),
                    output: path_1.join(context.root, outDir, path_1.basename(globbedFile)),
                });
            });
        }
        else {
            globbedFiles(asset.glob, path_1.join(context.root, asset.input), asset.ignore).forEach((globbedFile) => {
                files.push({
                    input: path_1.join(context.root, asset.input, globbedFile),
                    output: path_1.join(context.root, outDir, asset.output, globbedFile),
                });
            });
        }
    });
    return Object.assign(Object.assign({}, options), { assetFiles: files });
}
exports.default = normalizeAssetOptions;
//# sourceMappingURL=normalize-options.js.map