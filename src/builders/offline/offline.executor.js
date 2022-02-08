"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverlessOfflineExecutor = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const ignore_1 = require("ignore");
const fs_1 = require("fs");
const chokidar_1 = require("chokidar");
function getHttpServerArgs(options) {
    const args = [];
    if (options.port) {
        args.push(`-p ${options.port}`);
    }
    if (options.host) {
        args.push(`-a ${options.host}`);
    }
    if (options.ssl) {
        args.push(`-S`);
    }
    if (options.sslCert) {
        args.push(`-C ${options.sslCert}`);
    }
    if (options.sslKey) {
        args.push(`-K ${options.sslKey}`);
    }
    if (options.proxyUrl) {
        args.push(`-P ${options.proxyUrl}`);
    }
    return args;
}
function getBuildTargetCommand(options) {
    // "config": "apps/test-api-8/serverless.yml",
    //         "location": "dist/apps/test-api-8",
    //         "port": 7777
    const cmd = [
        'node',
        'D:/Projects/opensource/nx-11-test/nx-11-test-serverless/node_modules/serverless/bin/serverless.js',
        'offline',
        '--config apps/test-api-11/serverless.yml --location dist/apps/test-api-11 --port 7777',
    ];
    //   cmd.push(`offline`);
    // //   if (options.parallel) {
    // //     cmd.push(`--parallel`);
    // //   }
    // //   if (options.maxParallel) {
    // //     cmd.push(`--maxParallel=${options.maxParallel}`);
    // //   }
    return cmd.join(' ');
}
function getBuildTargetOutputPath(options, context) {
    let buildOptions;
    try {
        const [project, target, config] = options.buildTarget.split(':');
        const buildTarget = context.workspace.projects[project].targets[target];
        buildOptions = config
            ? Object.assign(Object.assign({}, buildTarget.options), buildTarget.configurations[config]) : buildTarget.options;
    }
    catch (e) {
        throw new Error(`Invalid buildTarget: ${options.buildTarget}`);
    }
    // TODO: vsavkin we should also check outputs
    const outputPath = buildOptions.outputPath;
    if (!outputPath) {
        throw new Error(`Invalid buildTarget: ${options.buildTarget}. The target must contain outputPath property.`);
    }
    return outputPath;
}
function getIgnoredGlobs(root) {
    const ig = ignore_1.default();
    try {
        ig.add(fs_1.readFileSync(`${root}/.gitignore`, 'utf-8'));
    }
    catch (_a) { }
    try {
        ig.add(fs_1.readFileSync(`${root}/.nxignore`, 'utf-8'));
    }
    catch (_b) { }
    return ig;
}
function createFileWatcher(root, sourceRoot, changeHandler) {
    const ignoredGlobs = getIgnoredGlobs(root);
    console.log(sourceRoot + '/**');
    const watcher = chokidar_1.watch([sourceRoot + '/**'], {
        cwd: root,
        ignoreInitial: true,
    });
    watcher.on('all', (_event, path) => {
        console.log('something happened');
        if (ignoredGlobs.ignores(path))
            return;
        changeHandler();
    });
    return { close: () => watcher.close() };
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
function serverlessOfflineExecutor(options, context) {
    return tslib_1.__asyncGenerator(this, arguments, function* serverlessOfflineExecutor_1() {
        console.log('executing offline');
        let running = false;
        const run = () => {
            console.log('running?' + running);
            if (!running) {
                running = true;
                try {
                    console.log('fork process');
                    console.log(getExecArgv(options));
                    child_process_1.fork('node_modules/serverless/bin/serverless.js', getExecArgv(options));
                    // execSync(getBuildTargetCommand(options), {
                    //   stdio: [0, 1, 2],
                    // });
                }
                catch (_a) { }
                running = false;
            }
        };
        console.log('watching:' + context.root);
        const watcher = createFileWatcher(context.root, context.workspace.projects[context.projectName].root, run);
        // perform initial run
        run();
        // const outputPath = getBuildTargetOutputPath(options, context);
        // const args = getHttpServerArgs(options);
        // console.log('executing serve');
        // const serve = exec(
        //   `node D:/Projects/opensource/nx-11-test/nx-11-test-serverless/node_modules/serverless/lib/Serverless.js offline --config apps/test-api-11/serverless.yml --location dist/apps/test-api-11 --port 7777`,
        //   {
        //     cwd: context.root,
        //   }
        // );
        // const processExitListener = () => {
        //   serve.kill();
        //   watcher.close();
        // };
        // process.on('exit', processExitListener);
        // process.on('SIGTERM', processExitListener);
        // serve.stdout.on('data', (chunk) => {
        //   if (chunk.toString().indexOf('GET') === -1) {
        //     process.stdout.write(chunk);
        //   }
        // });
        // serve.stderr.on('data', (chunk) => {
        //   process.stderr.write(chunk);
        // });
        yield yield tslib_1.__await({
            success: true,
            baseUrl: `${options.ssl ? 'https' : 'http'}://${options.host}:${options.port}`,
        });
        return yield tslib_1.__await(new Promise(() => {
            success: true;
        }));
    });
}
exports.serverlessOfflineExecutor = serverlessOfflineExecutor;
exports.default = serverlessOfflineExecutor;
//# sourceMappingURL=offline.executor.js.map