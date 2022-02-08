"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSchematic = exports.initGenerator = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const run_tasks_in_serial_1 = require("@nrwl/workspace/src/utilities/run-tasks-in-serial");
const versions_1 = require("../../utils/versions");
const add_jest_plugin_1 = require("./lib/add-jest-plugin");
const add_linter_plugin_1 = require("./lib/add-linter-plugin");
function addDependencies(host, expressProxy) {
    const dependencies = {};
    const tasks = [];
    const devDependencies = {
        '@flowaccount/nx-serverless': versions_1.nxVersion,
        serverless: versions_1.serverlessVersion,
        'serverless-offline': versions_1.serverlessOfflineVersion,
    };
    if (expressProxy) {
        dependencies['aws-serverless-express'] = versions_1.awsServerlessExpressVersion;
        dependencies['express'] = versions_1.expressVersion;
        devDependencies['@types/aws-serverless-express'] =
            versions_1.awsServerlessExpressVersion;
        devDependencies['serverless-apigw-binary'] = versions_1.serverlessApigwBinaryVersion;
    }
    else {
        devDependencies['@types/aws-lambda'] = versions_1.awsTypeLambdaVersion;
    }
    const packageJson = devkit_1.readJson(host, 'package.json');
    Object.keys(dependencies).forEach((key) => {
        if (packageJson.dependencies[key]) {
            delete dependencies[key];
        }
    });
    Object.keys(devDependencies).forEach((key) => {
        if (packageJson.devDependencies[key]) {
            delete devDependencies[key];
        }
    });
    if (!Object.keys(dependencies).length &&
        !Object.keys(devDependencies).length) {
        devkit_1.logger.info('Skipping update package.json');
        return tasks;
    }
    tasks.push(devkit_1.addDependenciesToPackageJson(host, dependencies, devDependencies));
    return tasks;
}
function updateDependencies(tree) {
    devkit_1.updateJson(tree, '/package.json', (json) => {
        if (json.dependencies['@flowaccount/nx-serverless']) {
            json.devDependencies['@flowaccount/nx-serverless'] =
                json.dependencies['@flowaccount/nx-serverless'];
            delete json.dependencies['@flowaccount/nx-serverless'];
        }
        else if (!json.devDependencies['@flowaccount/nx-serverless']) {
            json.devDependencies['@flowaccount/nx-serverless'] = versions_1.nxVersion;
        }
        return json;
    });
}
function initGenerator(tree, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tasks = [];
        if (!options.unitTestRunner || options.unitTestRunner === 'jest') {
            const jestTask = add_jest_plugin_1.addJestPlugin(tree);
            tasks.push(jestTask);
        }
        const linterTask = add_linter_plugin_1.addLinterPlugin(tree);
        tasks.push(linterTask);
        updateDependencies(tree);
        tasks.push(...addDependencies(tree, options.expressProxy));
        if (!options.skipFormat) {
            yield devkit_1.formatFiles(tree);
        }
        return run_tasks_in_serial_1.runTasksInSerial(...tasks);
    });
}
exports.initGenerator = initGenerator;
exports.initSchematic = devkit_1.convertNxGenerator(initGenerator);
//# sourceMappingURL=init.js.map