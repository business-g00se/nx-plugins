"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTarget = exports.deployExecutor = void 0;
const tslib_1 = require("tslib");
const serverless_1 = require("../../utils/serverless");
/* Fix for EMFILE: too many open files on serverless deploy */
const fs = require("fs");
const gracefulFs = require("graceful-fs"); // TODO: 0 this is not needed here anymore?
const packagers_1 = require("../../utils/packagers");
const target_schedulers_1 = require("../../utils/target.schedulers");
const devkit_1 = require("@nrwl/devkit");
gracefulFs.gracefulify(fs); // TODO: 0 this is not needed here anymore?
function deployExecutor(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // build into output path before running serverless offline.
        let packagePath = options.location;
        yield serverless_1.ServerlessWrapper.init(options, context);
        if (options.waitUntilTargets && options.waitUntilTargets.length > 0) {
            const results = yield target_schedulers_1.runWaitUntilTargets(options.waitUntilTargets, context);
            for (const [i, result] of results.entries()) {
                if (!result.success) {
                    console.log('throw');
                    throw new Error(`Wait until target failed: ${options.waitUntilTargets[i]}.`);
                }
            }
        }
        const iterator = yield buildTarget(options, context);
        const buildOutput = (yield iterator.next()).value;
        const prepResult = yield packagers_1.preparePackageJson(options, context, buildOutput.webpackStats, buildOutput.resolverName.toString(), buildOutput.tsconfig.toString()).toPromise();
        if (!prepResult.success) {
            throw new Error(`There was an error with the build. ${prepResult.error}`);
        }
        yield serverless_1.makeDistFileReadyForPackaging(options);
        const extraArgs = [];
        const commands = [];
        commands.push('deploy');
        if (options.function && options.function != '') {
            commands.push('function');
            extraArgs['function'] = `${options.function}`; // fix function deploy /wick
        }
        if (options.list) {
            commands.push('list');
        }
        yield serverless_1.runServerlessCommand(options, commands, extraArgs);
        return { success: true };
    });
}
exports.deployExecutor = deployExecutor;
function buildTarget(options, context) {
    return tslib_1.__asyncGenerator(this, arguments, function* buildTarget_1() {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__asyncValues(target_schedulers_1.startBuild(options, context)), _c; _c = yield tslib_1.__await(_b.next()), !_c.done;) {
                const event = _c.value;
                if (!event.success) {
                    devkit_1.logger.error('There was an error with the build. See above.');
                    devkit_1.logger.info(`${event.outfile} was not restarted.`);
                }
                yield yield tslib_1.__await(event);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield tslib_1.__await(_a.call(_b));
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
exports.buildTarget = buildTarget;
exports.default = deployExecutor;
//# sourceMappingURL=deploy.impl.js.map