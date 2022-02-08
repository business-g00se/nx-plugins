"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slsExecutor = void 0;
const tslib_1 = require("tslib");
const serverless_1 = require("../../utils/serverless");
/* Fix for EMFILE: too many open files on serverless deploy */
const fs = require("fs");
const gracefulFs = require("graceful-fs");
const packagers_1 = require("../../utils/packagers");
const target_schedulers_1 = require("../../utils/target.schedulers");
const deploy_impl_1 = require("../deploy/deploy.impl");
gracefulFs.gracefulify(fs);
function slsExecutor(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (options.waitUntilTargets && options.waitUntilTargets.length > 0) {
            const results = yield target_schedulers_1.runWaitUntilTargets(options.waitUntilTargets, context);
            for (const [i, result] of results.entries()) {
                if (!result.success) {
                    console.log('throw');
                    throw new Error(`Wait until target failed: ${options.waitUntilTargets[i]}.`);
                }
            }
        }
        const iterator = yield deploy_impl_1.buildTarget(options, context);
        const builderOutput = (yield iterator.next()).value;
        const prepResult = yield packagers_1.preparePackageJson(options, context, builderOutput.webpackStats, builderOutput.resolverName.toString(), builderOutput.tsconfig.toString()).toPromise();
        if (!prepResult.success) {
            throw new Error(`There was an error with the build. ${prepResult.error}`);
        }
        yield serverless_1.makeDistFileReadyForPackaging(options);
        const commands = [];
        commands.push(options.command);
        yield serverless_1.runServerlessCommand(options, commands);
        return { success: true };
    });
}
exports.slsExecutor = slsExecutor;
//# sourceMappingURL=sls.impl.js.map