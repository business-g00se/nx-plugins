"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiSchematic = exports.apiGenerator = void 0;
const tslib_1 = require("tslib");
const path = require("path");
const devkit_1 = require("@nrwl/devkit");
const workspace_1 = require("@nrwl/workspace");
const workspace_2 = require("@nrwl/workspace");
const init_1 = require("../init/init");
const utils_1 = require("../utils");
const path_1 = require("path");
const jest_1 = require("@nrwl/jest");
const linter_1 = require("@nrwl/linter");
// function updateNxJson(options: NormalizedSchema) {
//   return updateJsonInTree('/nx.json', json => {
//     return {
//       ...json,
//       projects: {
//         ...json.projects,
//         [options.name]: { tags: options.parsedTags }
//       }
//     };
//   });
// }
function getServeConfig(project, options) {
    return {
        builder: '@flowaccount/nx-serverless:offline',
        options: {
            buildTarget: options.name + ':build',
            config: devkit_1.joinPathFragments(options.appProjectRoot, 'serverless.ts'),
            location: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
            port: 7777,
        },
        configurations: {
            dev: {
                buildTarget: options.name + ':build:dev',
            },
            production: {
                buildTarget: options.name + ':build:production',
            },
        },
    };
}
function getDeployConfig(project, options) {
    return {
        builder: '@flowaccount/nx-serverless:deploy',
        options: {
            buildTarget: options.name + ':build:production',
            config: devkit_1.joinPathFragments(options.appProjectRoot, 'serverless.ts'),
            location: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
            package: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
            stage: 'dev',
        },
    };
}
function getDestroyConfig(options) {
    return {
        builder: '@flowaccount/nx-serverless:destroy',
        options: {
            buildTarget: options.name + ':build:production',
            config: devkit_1.joinPathFragments(options.appProjectRoot, 'serverless.ts'),
            location: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
            package: devkit_1.joinPathFragments(path_1.normalize('dist'), options.appProjectRoot),
        },
    };
}
function updateWorkspaceJson(host, options) {
    const project = {
        root: options.appProjectRoot,
        sourceRoot: devkit_1.joinPathFragments(options.appProjectRoot, 'src'),
        projectType: workspace_1.ProjectType.Application,
        prefix: options.name,
        schematics: {},
        targets: {},
        tags: {},
    };
    project.targets.build = utils_1.getBuildConfig(options);
    project.targets.serve = getServeConfig(project, options);
    project.targets.deploy = getDeployConfig(project, options);
    project.targets.destroy = getDestroyConfig(options);
    // project.targets.lint = generateProjectLint(
    //   normalize(project.root),
    //   joinPathFragments(normalize(project.root), 'tsconfig.app.json'),
    //   options.linter
    // );
    project.tags = options.parsedTags;
    devkit_1.addProjectConfiguration(host, options.name, project);
    // return updateWorkspaceInTree(workspaceJson => {
    // workspaceJson.projects[options.name] = project;
    // workspaceJson.defaultProject = workspaceJson.defaultProject || options.name;
    // return workspaceJson;
    // });
}
function addAppFiles(host, options) {
    const templateOptions = Object.assign(Object.assign(Object.assign({}, options), devkit_1.names(options.name)), { offset: devkit_1.offsetFromRoot(options.appProjectRoot), template: '', root: options.appProjectRoot, serviceName: options.name.replace('.', '-'), baseWorkspaceTsConfig: options.baseWorkspaceTsConfig });
    devkit_1.generateFiles(host, path.join(__dirname, 'files'), options.appProjectRoot, templateOptions);
    //   mergeWith(
    //   apply(url('./files/app'), [
    //     template({
    //       tmpl: '',
    //       name: options.name,
    //       root: options.appProjectRoot,
    //       baseWorkspaceTsConfig: options.baseWorkspaceTsConfig,
    //       offset: offsetFromRoot(options.appProjectRoot)
    //     }),
    //     move(options.appProjectRoot)
    //   ])
    // );
}
// function addServerlessYMLFile(host: Tree, options: NormalizedSchema) {
//   // return (host: Tree) => {
//     host.create(
//       join(options.appProjectRoot, 'serverless.ts'),
//       `service: ${options.name}
// frameworkVersion: ">=1.1.0"
// plugins:
//   - serverless-offline
// package:
//   individually: true
//   excludeDevDependencies: false
//   # path: ${join(normalize('dist'), options.appProjectRoot)}
// provider:
//   name: ${options.provider}
//   region: ${options.region}
//   endpointType: ${options.endpointType}
//   runtime: nodejs10.x
// functions:
//   hello-world:
//     handler: src/handler.helloWorld
//     events:
//       - http:
//           path: hello-world
//           method: get
//       `
//     );
//   // };
// }
// function addProxy(host: Tree, options: NormalizedSchema) {
//   // return (host: Tree, context: SchematicContext) => {
//     const projectConfig = getProjectConfig(host, options.frontendProject);
//     if (projectConfig.architect && projectConfig.architect.serve) {
//       const pathToProxyFile = `${projectConfig.root}/proxy.conf.json`;
//       const apiname = `/${options.name}-api`;
//       host.create(
//         pathToProxyFile,
//         JSON.stringify(
//           {
//             apiname: {
//               target: 'http://localhost:3333',
//               secure: false
//             }
//           },
//           null,
//           2
//         )
//       );
//       updateWorkspaceInTree(json => {
//         projectConfig.architect.serve.options.proxyConfig = pathToProxyFile;
//         json.projects[options.frontendProject] = projectConfig;
//         return json;
//       })
//       //(host, context);
//     //}
//   };
// }
function normalizeOptions(options) {
    const appDirectory = options.directory
        ? `${workspace_2.toFileName(options.directory)}/${workspace_2.toFileName(options.name)}`
        : workspace_2.toFileName(options.name);
    const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');
    const appProjectRoot = devkit_1.joinPathFragments(path_1.normalize('apps'), appDirectory);
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    return Object.assign(Object.assign({}, options), { name: workspace_2.toFileName(appProjectName), frontendProject: options.frontendProject
            ? workspace_2.toFileName(options.frontendProject)
            : undefined, appProjectRoot, provider: options.provider, parsedTags, endpointType: options.endpointType ? undefined : options.endpointType });
}
function apiGenerator(host, schema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const options = normalizeOptions(schema);
        init_1.initGenerator(host, {
            skipFormat: true,
            expressProxy: false,
            unitTestRunner: options.unitTestRunner,
        });
        // addServerlessYMLFile(host, options);
        addAppFiles(host, options);
        updateWorkspaceJson(host, options);
        yield linter_1.lintProjectGenerator(host, { project: options.name, skipFormat: true });
        if (!options.unitTestRunner || options.unitTestRunner === 'jest') {
            yield jest_1.jestProjectGenerator(host, {
                project: options.name,
                setupFile: 'none',
                skipSerializers: true,
            });
        }
        // updateNxJson(options);
        // options.unitTestRunner === 'jest'
        //   ? externalSchematic('@nrwl/jest', 'jest-project', {
        //       project: options.name,
        //       setupFile: 'none',
        //       skipSerializers: true
        //     })
        //   : noop();
        // options.frontendProject ? addProxy(host, options) : noop();
        yield devkit_1.formatFiles(host);
    });
}
exports.apiGenerator = apiGenerator;
exports.default = apiGenerator;
exports.apiSchematic = devkit_1.convertNxGenerator(apiGenerator);
//# sourceMappingURL=api.js.map