"use strict";
// npx scully --nw --configFile apps/frontend/flowaccount-landing/scully.config.js --removeStaticDist
Object.defineProperty(exports, "__esModule", { value: true });
exports.scullyCmdRunner = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const deploy_impl_1 = require("../deploy/deploy.impl");
const run_commands_impl_1 = require("@nrwl/workspace/src/executors/run-commands/run-commands.impl");
const normalize_1 = require("../../utils/normalize");
function scullyCmdRunner(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //
        if (options.skipBuild) {
            yield runScully(options, context);
        }
        else {
            const iterator = yield deploy_impl_1.buildTarget(options, context);
            const event = (yield iterator.next()).value;
            if (!event.success) {
                devkit_1.logger.error('Build target failed!');
                return { success: false };
            }
            yield runScully(options, context);
        }
        return { success: true };
    });
}
exports.scullyCmdRunner = scullyCmdRunner;
exports.default = scullyCmdRunner;
function runScully(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const commands = [];
        const args = getExecArgv(options);
        options.configFiles.forEach((fileName) => {
            commands.push({
                command: `scully --configFile=${fileName} --disableProjectFolderCheck ${args.join(' ')}`,
            });
            console.log(`scully --configFile=${fileName} --disableProjectFolderCheck ${args.join(' ')}`);
        });
        const root = normalize_1.getSourceRoot(context);
        yield run_commands_impl_1.default({
            commands: commands,
            cwd: root,
            color: true,
            parallel: false,
        }, context);
    });
}
function getExecArgv(options) {
    const args = [];
    const keys = Object.keys(options);
    keys.forEach((key) => {
        if (options[key] !== undefined &&
            key !== 'buildTarget' &&
            key != 'configFiles' &&
            key != 'skipBuild') {
            // if(typeof(options[key]) == 'boolean') {
            //   args.push(`--${key}`);
            // } else {
            args.push(`--${key}=${options[key]}`);
            // }
        }
    });
    return args;
}
//# sourceMappingURL=scully.impl.js.map