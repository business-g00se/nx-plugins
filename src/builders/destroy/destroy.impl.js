"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyExecutor = void 0;
const tslib_1 = require("tslib");
const serverless_1 = require("../../utils/serverless");
const deploy_impl_1 = require("../deploy/deploy.impl");
const devkit_1 = require("@nrwl/devkit");
function destroyExecutor(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const iterator = yield deploy_impl_1.buildTarget(options, context);
        const event = (yield iterator.next()).value; // ServerlessBuildEvent
        if (event.success) {
            // build into output path before running serverless offline.
            const commands = [];
            commands.push('remove');
            yield serverless_1.runServerlessCommand(options, commands);
            return { success: true };
        }
        else {
            devkit_1.logger.error('There was an error with the build. See above.');
            devkit_1.logger.info(`${event.outfile} was not restarted.`);
            throw new Error(`${event.outfile} was not restarted.`);
        }
    });
}
exports.destroyExecutor = destroyExecutor;
//# sourceMappingURL=destroy.impl.js.map