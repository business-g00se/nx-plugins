"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlineExecutor = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const treeKill = require("tree-kill");
const target_schedulers_1 = require("../../utils/target.schedulers");
const devkit_1 = require("@nrwl/devkit");
const util_1 = require("util");
try {
    require('dotenv').config();
}
catch (e) { }
let subProcess = null;
function offlineExecutor(options, context) {
    return tslib_1.__asyncGenerator(this, arguments, function* offlineExecutor_1() {
        var e_1, _a;
        process.on('SIGTERM', () => {
            subProcess === null || subProcess === void 0 ? void 0 : subProcess.kill();
            process.exit(128 + 15);
        });
        process.on('exit', (code) => {
            process.exit(code);
        });
        if (options.skipBuild) {
            if (options.waitUntilTargets && options.waitUntilTargets.length > 0) {
                const results = yield tslib_1.__await(target_schedulers_1.runWaitUntilTargets(options.waitUntilTargets, context));
                for (const [i, result] of results.entries()) {
                    if (!result.success) {
                        console.log('throw');
                        throw new Error(`Wait until target failed: ${options.waitUntilTargets[i]}.`);
                    }
                }
            }
        }
        options.watch = true;
        try {
            for (var _b = tslib_1.__asyncValues(target_schedulers_1.startBuild(options, context)), _c; _c = yield tslib_1.__await(_b.next()), !_c.done;) {
                const event = _c.value;
                if (!event.success) {
                    devkit_1.logger.error('There was an error with the build. See above.');
                    devkit_1.logger.info(`${event.outfile} was not restarted.`);
                }
                devkit_1.logger.info(`handleBuildEvent.`);
                yield tslib_1.__await(handleBuildEvent(event, options));
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
        return yield tslib_1.__await(new Promise(() => {
            success: true;
        }));
    });
}
exports.offlineExecutor = offlineExecutor;
function handleBuildEvent(event, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if ((!event.success || options.watch) && subProcess) {
            yield killProcess();
        }
        devkit_1.logger.info('running process');
        runProcess(event, options);
    });
}
function runProcess(event, options) {
    if (subProcess || !event.success) {
        return;
    }
    subProcess = child_process_1.fork('node_modules/serverless/bin/serverless.js', getExecArgv(options));
}
function killProcess() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!subProcess) {
            return;
        }
        const promisifiedTreeKill = util_1.promisify(treeKill);
        try {
            yield promisifiedTreeKill(subProcess.pid, 'SIGTERM');
        }
        catch (err) {
            if (Array.isArray(err) && err[0] && err[2]) {
                const errorMessage = err[2];
                devkit_1.logger.error(errorMessage);
            }
            else if (err.message) {
                devkit_1.logger.error(err.message);
            }
        }
        finally {
            subProcess = null;
        }
    });
}
function getServerlessArg(options) {
    const args = ['offline', ...options.args];
    if (options.inspect === true) {
        options.inspect = "inspect" /* Inspect */;
    }
    if (options.inspect) {
        args.push(`--${options.inspect}=${options.host}:${options.port}`);
    }
    return args;
}
function getExecArgv(options) {
    const args = [];
    if (options.inspect === true) {
        options.inspect = "inspect" /* Inspect */;
    }
    if (options.inspect) {
        args.push(`--${options.inspect}=${options.host}:${options.port}`);
    }
    args.push('offline');
    for (const key in options) {
        if (options.hasOwnProperty(key)) {
            if (options[key] !== undefined) {
                args.push(`--${key}=${options[key]}`);
            }
        }
    }
    return args;
}
exports.default = offlineExecutor;
//# sourceMappingURL=offline.impl.js.map