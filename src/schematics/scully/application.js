"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scullyAppSchematic = exports.scullyAppGenerator = void 0;
const tslib_1 = require("tslib");
const workspace_1 = require("@nrwl/workspace");
const init_1 = require("../init/init");
const utils_1 = require("../utils");
const path_1 = require("path");
const devkit_1 = require("@nrwl/devkit");
function getServeConfig(options) {
    return {
        executor: '@flowaccount/nx-serverless:offline',
        options: {
            waitUntilTargets: [options.project + ':scully'],
            buildTarget: options.project + ':compile',
            config: path_1.join(options.appProjectRoot, 'serverless.ts'),
            location: path_1.join(path_1.normalize('dist'), options.appProjectRoot),
        },
        configurations: {
            dev: {
                buildTarget: options.project + ':compile:dev',
            },
            production: {
                buildTarget: options.project + ':compile:production',
            },
        },
    };
}
function getScullyBuilderConfig(options) {
    return {
        executor: '@flowaccount/nx-serverless:scully',
        options: {
            buildTarget: options.project + ':build:production',
            configFiles: [path_1.join(options.appProjectRoot, 'scully.config.js')],
            scanRoutes: true,
            removeStaticDist: true,
            skipBuild: false,
        },
    };
}
function getDeployConfig(options) {
    return {
        executor: '@flowaccount/nx-serverless:deploy',
        options: {
            waitUntilTargets: [options.project + ':scully'],
            buildTarget: options.project + ':compile:production',
            config: path_1.join(options.appProjectRoot, 'serverless.ts'),
            location: path_1.join(path_1.normalize('dist'), options.appProjectRoot),
            package: path_1.join(path_1.normalize('dist'), options.appProjectRoot),
        },
    };
}
function getDestroyConfig(options) {
    return {
        executor: '@flowaccount/nx-serverless:destroy',
        options: {
            buildTarget: options.project + ':compile:production',
            config: path_1.join(options.appProjectRoot, 'serverless.ts'),
            location: path_1.join(path_1.normalize('dist'), options.appProjectRoot),
            package: path_1.join(path_1.normalize('dist'), options.appProjectRoot),
        },
    };
}
function updateWorkspaceJson(host, options, project) {
    const buildConfig = utils_1.getBuildConfig(options);
    buildConfig.options['skipClean'] = true;
    buildConfig.options['outputPath'] = path_1.normalize('dist');
    buildConfig.options['tsConfig'] = path_1.join(options.appProjectRoot, 'tsconfig.serverless.json');
    buildConfig.executor = '@flowaccount/nx-serverless:compile';
    project.targets.compile = buildConfig;
    project.targets.scully = getScullyBuilderConfig(options);
    project.targets.offline = getServeConfig(options);
    project.targets.deploy = getDeployConfig(options);
    project.targets.destroy = getDestroyConfig(options);
    devkit_1.updateProjectConfiguration(host, options.project, project);
}
function addAppFiles(host, options) {
    const templateOptions = Object.assign(Object.assign(Object.assign({}, options), devkit_1.names(options.project)), { offsetFromRoot: workspace_1.offsetFromRoot(options.appProjectRoot), template: '', root: options.appProjectRoot });
    devkit_1.generateFiles(host, path_1.join(__dirname, 'files'), options.appProjectRoot, templateOptions);
    // return mergeWith(
    //   apply(url('./files/app'), [
    //     template({
    //       tmpl: '',
    //       name: options.project,
    //       root: options.appProjectRoot,
    //       offset: offsetFromRoot(options.appProjectRoot)
    //     }),
    //     move(options.appProjectRoot)
    //   ])
    // );
}
// function addServerlessYMLFile(options: NormalizedSchema): Rule {
//   return (host: Tree) => {
//     host.create(
//       join(options.appProjectRoot, 'serverless.ts'),
//       `service: ${options.project}
// frameworkVersion: ">=1.1.0"
// plugins:
//   - serverless-offline
//   - serverless-apigw-binary
// package:
//   individually: true
//   excludeDevDependencies: false
//   # path: ${join(normalize('dist'), options.appProjectRoot)}
//   custom:
//     enable_optimize:
//       local: false
// provider:
//   name: ${options.provider}
//   region: ${options.region}
//   endpointType: ${options.endpointType}
//   runtime: nodejs10.x
//   memorySize: 192
//   timeout: 10
// custom:
//   apigwBinary:
//     types:
//       - '*/*'
// functions:
//   web-app:
//     handler: handler.webApp
//     events:
//       - http: ANY {proxy+}
//       - http: ANY /
//       `
//     );
//   };
// }
function normalizeOptions(project, options) {
    return Object.assign(Object.assign({}, options), { appProjectRoot: project.root, endpointType: options.endpointType ? undefined : options.endpointType });
}
function scullyAppGenerator(host, schema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const project = devkit_1.readProjectConfiguration(host, schema.project);
        const options = normalizeOptions(project, schema);
        init_1.initGenerator(host, {
            skipFormat: options.skipFormat,
            expressProxy: true,
            unitTestRunner: '',
        });
        // options.addScully
        //   ? externalSchematic('@scullyio/scully', 'run', {
        //     })
        //   : noop(),
        addAppFiles(host, options),
            // addServerlessYMLFile(options),
            updateWorkspaceJson(host, options, project);
    });
}
exports.scullyAppGenerator = scullyAppGenerator;
exports.default = scullyAppGenerator;
exports.scullyAppSchematic = devkit_1.convertNxGenerator(scullyAppGenerator);
//# sourceMappingURL=application.js.map