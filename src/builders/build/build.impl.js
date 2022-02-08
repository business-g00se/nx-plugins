"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverlessBuilder = exports.buildExecutor = void 0;
const tslib_1 = require("tslib");
const operators_1 = require("rxjs/operators");
const node_config_1 = require("../../utils/node.config");
const normalize_1 = require("../../utils/normalize");
const serverless_1 = require("../../utils/serverless");
// import { wrapMiddlewareBuildOptions } from '../../utils/middleware';;
const path_1 = require("path");
const fs_1 = require("fs");
const serverless_config_1 = require("../../utils/serverless.config");
const copy_asset_files_1 = require("../../utils/copy-asset-files");
const normalize_options_1 = require("../../utils/normalize-options");
const devkit_1 = require("@nrwl/devkit");
const run_webpack_1 = require("@nrwl/workspace/src/utilities/run-webpack");
const webpack = require("webpack");
const rxjs_for_await_1 = require("rxjs-for-await");
function buildExecutor(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const root = normalize_1.getSourceRoot(context);
        options = normalize_1.normalizeBuildOptions(options, context.root, root);
        yield serverless_1.ServerlessWrapper.init(options, context);
        options = normalize_1.assignEntriesToFunctionsFromServerless(options, context.root);
        options.tsConfig = serverless_config_1.consolidateExcludes(options);
        options.entry = options.files;
        const config = (options).webpackConfig.reduce((currentConfig, plugin) => {
            return require(plugin)(currentConfig, {
                options,
                configuration: context.configurationName,
            });
        }, node_config_1.getNodeWebpackConfig(options));
        const resultCopy = copy_asset_files_1.copyAssetFilesSync(normalize_options_1.default(options, context));
        if (!resultCopy.success) {
            throw new Error(`Error building serverless application ${resultCopy.error}`);
        }
        devkit_1.logger.info('start compiling webpack');
        /*
            , {
              logging: stats => {
                logger.info(stats.toString(config.stats));
              }
            }*/
        const iterator = rxjs_for_await_1.eachValueFrom(run_webpack_1.runWebpack(config, webpack).pipe(operators_1.tap((stats) => {
            console.info(stats.toString(config.stats));
            if (options.statsJson) {
                const statsJsonFile = path_1.resolve(context.root, options.outputPath, 'stats.json');
                fs_1.writeFileSync(statsJsonFile, JSON.stringify(stats.toJson('verbose')));
            }
        }), operators_1.map((stats) => {
            return {
                success: !stats.hasErrors(),
                outfile: path_1.resolve(context.root, options.outputPath),
                webpackStats: stats.toJson(config.stats),
                resolverName: 'WebpackDependencyResolver',
                tsconfig: options.tsConfig,
            };
        })));
        const event = (yield iterator.next()).value;
        return event;
    });
}
exports.buildExecutor = buildExecutor;
exports.default = buildExecutor;
exports.serverlessBuilder = devkit_1.convertNxExecutor(buildExecutor);
//# sourceMappingURL=build.impl.js.map