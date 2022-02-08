"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildConfig = void 0;
const devkit_1 = require("@nrwl/devkit");
const path_1 = require("path");
function getBuildConfig(options) {
    return {
        executor: '@flowaccount/nx-serverless:build',
        options: {
            outputPath: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
            package: options.appProjectRoot,
            serverlessConfig: devkit_1.joinPathFragments(options.appProjectRoot, 'serverless.ts'),
            servicePath: options.appProjectRoot,
            tsConfig: devkit_1.joinPathFragments(options.appProjectRoot, 'tsconfig.app.json'),
            provider: options.provider,
            processEnvironmentFile: 'env.json',
        },
        configurations: {
            dev: {
                optimization: false,
                sourceMap: false,
                budgets: [
                    {
                        type: 'initial',
                        maximumWarning: '2mb',
                        maximumError: '5mb',
                    },
                ],
            },
            production: {
                optimization: true,
                sourceMap: false,
                extractCss: true,
                namedChunks: false,
                extractLicenses: true,
                vendorChunk: false,
                budgets: [
                    {
                        type: 'initial',
                        maximumWarning: '2mb',
                        maximumError: '5mb',
                    },
                ],
                fileReplacements: [
                    {
                        replace: devkit_1.joinPathFragments(options.appProjectRoot, 'environment.ts'),
                        with: devkit_1.joinPathFragments(options.appProjectRoot, 'environment.prod.ts'),
                    },
                ],
            },
        },
    };
}
exports.getBuildConfig = getBuildConfig;
//# sourceMappingURL=utils.js.map