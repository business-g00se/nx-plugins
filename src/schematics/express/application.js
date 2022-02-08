"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressApiSchematic = exports.expressApiGenerator = void 0;
const tslib_1 = require("tslib");
const workspace_1 = require("@nrwl/workspace");
const workspace_2 = require("@nrwl/workspace");
const init_1 = require("../init/init");
const utils_1 = require("../utils");
const path_1 = require("path");
const devkit_1 = require("@nrwl/devkit");
const express_1 = require("@nrwl/express");
const init_2 = require("@nrwl/express/src/generators/init/init");
function getServeConfig(options) {
    return {
        executor: '@flowaccount/nx-serverless:offline',
        options: {
            waitUntilTargets: [options.name + ':build'],
            buildTarget: options.name + ':compile',
            config: devkit_1.joinPathFragments(options.appProjectRoot, 'serverless.ts'),
            location: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
        },
        configurations: {
            dev: {
                buildTarget: options.name + ':compile:dev',
            },
            production: {
                buildTarget: options.name + ':compile:production',
            },
        },
    };
}
function getDeployConfig(options) {
    return {
        executor: '@flowaccount/nx-serverless:deploy',
        options: {
            waitUntilTargets: [options.name + ':build:production'],
            buildTarget: options.name + ':compile:production',
            config: devkit_1.joinPathFragments(options.appProjectRoot, 'serverless.ts'),
            location: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
            package: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
            stage: 'dev',
        },
    };
}
function getDestroyConfig(options) {
    return {
        executor: '@flowaccount/nx-serverless:destroy',
        options: {
            buildTarget: options.name + ':compile:production',
            config: devkit_1.joinPathFragments(options.appProjectRoot, 'serverless.ts'),
            location: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
            package: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
        },
    };
}
function updateWorkspaceJson(host, options, project) {
    const buildConfig = utils_1.getBuildConfig(options);
    buildConfig.options['skipClean'] = true;
    buildConfig.options['outputPath'] = path_1.normalize('dist');
    buildConfig.options['tsConfig'] = devkit_1.joinPathFragments(options.appProjectRoot, 'tsconfig.serverless.json');
    buildConfig.executor = '@flowaccount/nx-serverless:compile';
    project.targets.compile = buildConfig;
    project.targets.offline = getServeConfig(options);
    project.targets.deploy = getDeployConfig(options);
    project.targets.destroy = getDestroyConfig(options);
    devkit_1.updateProjectConfiguration(host, options.name, project);
}
function addAppFiles(host, options) {
    const templateOptions = Object.assign(Object.assign(Object.assign({}, options), devkit_1.names(options.name)), { offset: workspace_2.offsetFromRoot(options.appProjectRoot), template: '', root: options.appProjectRoot });
    devkit_1.generateFiles(host, path_1.join(__dirname, 'files'), options.appProjectRoot, templateOptions);
    // return (tree: Tree, _context: SchematicContext) => {
    //   const rule = mergeWith(
    //     apply(url('./files/app'), [
    //       template({
    //         tmpl: '',
    //         name: options.name,
    //         root: options.appProjectRoot,
    //         offset: offsetFromRoot(options.appProjectRoot)
    //       }),
    //       move(options.appProjectRoot),
    //       forEach((fileEntry: FileEntry) => {
    //         // Just by adding this is allows the file to be overwritten if it already exists
    //         if (tree.exists(fileEntry.path)) return null;
    //         return fileEntry;
    //       })
    //     ])
    //   );
    //   return rule(tree, _context);
    // };
}
// function updateServerTsFile(host:Tree, options: NormalizedSchema) {
//     const modulePath = `${options.appProjectRoot}/server.ts`;
//     const content: Buffer | null = host.read(modulePath);
//     let moduleSource = '';
//     if (!content) {
//       context.logger.error('Cannot find server.ts to replace content!');
//       return host;
//     }
//     moduleSource = content.toString('utf-8');
//     const tsSourceFile = ts.createSourceFile(
//       join(options.appProjectRoot, 'server.ts'),
//       moduleSource,
//       ts.ScriptTarget.Latest,
//       true
//     );
//     context.logger.info(
//       'updating server.ts to support serverless-express and production mode.'
//     );
//     host.overwrite(
//       modulePath,
//       moduleSource.replace(
//         `join(process.cwd(), 'dist/${options.name}/browser')`,
//         `environment.production ? join(process.cwd(), './browser') : join(process.cwd(), 'dist/${options.appProjectRoot}/browser')`
//       )
//     );
//     insert(host, modulePath, [
//       insertImport(
//         tsSourceFile,
//         modulePath,
//         'environment',
//         './src/environments/environment'
//       )
//     ]);
// }
// function addServerlessYMLFile(options: NormalizedSchema): Rule {
//   return (host: Tree) => {
//     host.create(
//       join(options.appProjectRoot, 'serverless.ts'),
//       `service: ${options.name}
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
function normalizeOptions(options) {
    const appDirectory = options.directory
        ? `${workspace_1.toFileName(options.directory)}/${workspace_1.toFileName(options.name)}`
        : workspace_1.toFileName(options.name);
    const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');
    const appProjectRoot = devkit_1.joinPathFragments(path_1.normalize('apps'), appDirectory);
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    return Object.assign(Object.assign({}, options), { name: workspace_1.toFileName(appProjectName), frontendProject: options.frontendProject
            ? workspace_1.toFileName(options.frontendProject)
            : undefined, appProjectRoot, provider: options.provider, parsedTags, endpointType: options.endpointType ? undefined : options.endpointType });
}
function expressApiGenerator(host, schema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const options = normalizeOptions(schema);
        init_1.initGenerator(host, {
            skipFormat: options.skipFormat,
            expressProxy: true,
            unitTestRunner: options.unitTestRunner,
        });
        if (options.initExpress) {
            yield init_2.initGenerator(host, {
                unitTestRunner: options.unitTestRunner,
            });
            yield express_1.applicationGenerator(host, {
                name: schema.name,
                skipFormat: schema.skipFormat,
                skipPackageJson: schema.skipPackageJson,
                directory: schema.directory,
                unitTestRunner: schema.unitTestRunner,
                tags: schema.tags,
                linter: schema.linter,
                frontendProject: schema.frontendProject,
                js: false,
                pascalCaseFiles: false,
            });
        }
        addAppFiles(host, options);
        // addServerlessYMLFile(options),
        // updateServerTsFile(options),
        const project = devkit_1.readProjectConfiguration(host, options.name);
        updateWorkspaceJson(host, options, project);
    });
}
exports.expressApiGenerator = expressApiGenerator;
exports.default = expressApiGenerator;
exports.expressApiSchematic = devkit_1.convertNxGenerator(expressApiGenerator);
//# sourceMappingURL=application.js.map