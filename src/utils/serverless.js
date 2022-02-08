"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDistFileReadyForPackaging = exports.runServerlessCommand = exports.getExecArgv = exports.ServerlessWrapper = void 0;
const tslib_1 = require("tslib");
const Serverless = require("serverless/lib/Serverless");
const readConfiguration = require("serverless/lib/configuration/read");
const path = require("path");
const fs = require("fs");
const copy_asset_files_1 = require("./copy-asset-files");
// import * as componentsV2  from '@serverless/components';
const devkit_1 = require("@nrwl/devkit");
const gracefulFs = require("graceful-fs");
gracefulFs.gracefulify(fs); // fix serverless too many files open error on windows. /wick
class ServerlessWrapper {
    constructor() { }
    static get serverless() {
        if (this.serverless$ === null) {
            throw new Error('Please initialize serverless before usage, or pass option for initialization.');
        }
        return this.serverless$;
    }
    static isServerlessDeployBuilderOptions(arg) {
        return arg.buildTarget !== undefined;
    }
    static init(options, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.serverless$ === null) {
                devkit_1.logger.debug('Starting to Initiate Serverless Instance');
                let buildOptions;
                let deployOptions;
                // fix serverless issue wher eit resolveCliInput only once and not everytime init is called
                const commands = [];
                const extraArgs = {};
                if (ServerlessWrapper.isServerlessDeployBuilderOptions(options)) {
                    deployOptions = options;
                    commands.push('deploy');
                    if (deployOptions.function && deployOptions.function != '') {
                        commands.push('function');
                        extraArgs['function'] = `${deployOptions.function}`;
                    }
                    if (deployOptions.list) {
                        commands.push('list');
                    }
                    const buildTarget = devkit_1.parseTargetString(deployOptions.buildTarget);
                    buildOptions = devkit_1.readTargetOptions(buildTarget, context);
                    if (buildOptions) {
                        options = buildOptions;
                    }
                }
                else {
                    buildOptions = options;
                }
                try {
                    if (fs.existsSync(path.join(buildOptions.servicePath, buildOptions.processEnvironmentFile))) {
                        devkit_1.logger.debug('Loading Environment Variables');
                        require('dotenv-json')({
                            path: path.join(buildOptions.servicePath, buildOptions.processEnvironmentFile),
                        });
                        devkit_1.logger.info(`Environment variables set according to ${buildOptions.processEnvironmentFile}`);
                    }
                    else {
                        devkit_1.logger.error('No env.json found! no environment will be set!');
                    }
                }
                catch (e) {
                    devkit_1.logger.error(e);
                }
                devkit_1.logger.debug('Reading Configuration');
                const typescriptConfig = fs.existsSync(path.join(buildOptions.servicePath, 'serverless.ts'));
                const configFileName = typescriptConfig
                    ? 'serverless.ts'
                    : 'serverless.yml';
                const configurationInput = yield readConfiguration(path.resolve(buildOptions.servicePath, configFileName));
                devkit_1.logger.debug('Resolved configurations');
                configurationInput.useDotenv = false;
                devkit_1.logger.debug('Initiating Serverless Instance');
                const serverlessConfig = {
                    commands: [
                        'deploy',
                        'offline',
                        'deploy list',
                        'destroy',
                        'deploy function',
                        'sls',
                    ],
                    configuration: configurationInput,
                    serviceDir: buildOptions.servicePath,
                    configurationFilename: configFileName,
                };
                if (deployOptions) {
                    serverlessConfig.serviceDir = getPackagePath(deployOptions);
                }
                this.serverless$ = new Serverless(serverlessConfig);
                // if (componentsV2.runningComponents()) return () => componentsV2.runComponents();
                if (this.serverless$.version &&
                    this.serverless$.version.split('.')[0] > '1') {
                    devkit_1.logger.info('Disable "Resolve Configuration Internally" for serverless 2.0+.');
                    this.serverless$._shouldResolveConfigurationInternally = false;
                    this.serverless$.isLocallyInstalled = true;
                }
                // fix serverless issue wher eit resolveCliInput only once and not everytime init is called
                if (deployOptions) {
                    this.serverless$.processedInput = {
                        commands: commands,
                        options: extraArgs,
                    };
                    devkit_1.logger.info('serverless$.processedInput is set with deploy arguments');
                }
                // fix serverless issue wher eit resolveCliInput only once and not everytime init is called
                yield this.serverless$.init();
                yield this.serverless$.service.load({
                    config: buildOptions.serverlessConfig,
                });
                if (deployOptions) {
                    this.serverless$.service.provider.stage = deployOptions.stage;
                }
                yield this.serverless$.variables
                    .populateService(this.serverless$.pluginManager.cliOptions)
                    .then(() => {
                    // merge arrays after variables have been populated
                    // (https://github.com/serverless/serverless/issues/3511)
                    this.serverless$.service.mergeArrays();
                    // validate the service configuration, now that variables are loaded
                    this.serverless$.service.validate();
                });
                this.serverless$.cli.asciiGreeting();
                return null;
            }
            else {
                return null;
            }
        });
    }
}
exports.ServerlessWrapper = ServerlessWrapper;
ServerlessWrapper.serverless$ = null;
function getPackagePath(deployOptions) {
    let packagePath = '';
    if (!deployOptions.serverlessPackagePath &&
        deployOptions.location.indexOf('dist/') > -1) {
        packagePath = deployOptions.location.replace('dist/', 'dist/.serverlessPackages/');
    }
    else if (deployOptions.serverlessPackagePath) {
        packagePath = deployOptions.serverlessPackagePath;
    }
    return packagePath;
}
function getExecArgv(options) {
    const serverlessOptions = [];
    const extraArgs = copy_asset_files_1.parseArgs(options);
    Object.keys(extraArgs).map((a) => serverlessOptions.push(`--${a} ${extraArgs[a]}`));
    console.log(serverlessOptions);
    return serverlessOptions;
}
exports.getExecArgv = getExecArgv;
function runServerlessCommand(options, commands, extraArgs = null) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // change servicePath to distribution location
        // review: Change options from location to outputpath?\
        let args = getExecArgv(options);
        const serviceDir = ServerlessWrapper.serverless.serviceDir;
        if (extraArgs) {
            args = args.concat(extraArgs);
        }
        devkit_1.logger.info('running serverless commands');
        ServerlessWrapper.serverless.processedInput = {
            commands: commands,
            options: args,
        };
        ServerlessWrapper.serverless.isTelemetryReportedExternally = true;
        try {
            const packagePath = getPackagePath(options);
            devkit_1.logger.debug(`Serverless service path is ${packagePath}`);
            ServerlessWrapper.serverless.serviceDir = packagePath;
            yield ServerlessWrapper.serverless.run();
            ServerlessWrapper.serverless.serviceDir = serviceDir;
        }
        catch (ex) {
            throw new Error(`There was an error with the build. ${ex}.`);
        }
    });
}
exports.runServerlessCommand = runServerlessCommand;
function makeDistFileReadyForPackaging(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let readyToPackaged = null;
        options.serverlessPackagePath = getPackagePath(options);
        readyToPackaged = yield copy_asset_files_1.copyBuildOutputToBePackaged(options);
        if (readyToPackaged == null) {
            throw new Error(`readyToPackaged is null something went wrong in 'copyBuildOutputToBePackaged'.`);
        }
        if (!readyToPackaged.success) {
            throw new Error(`readyToPackaged is null something went wrong in 'copyBuildOutputToBePackaged'.`);
        }
    });
}
exports.makeDistFileReadyForPackaging = makeDistFileReadyForPackaging;
function resolveLocalServerlessPath() {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=serverless.js.map