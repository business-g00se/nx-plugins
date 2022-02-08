"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJestPlugin = void 0;
const jest_1 = require("@nrwl/jest");
const devkit_1 = require("@nrwl/devkit");
const run_tasks_in_serial_1 = require("@nrwl/workspace/src/utilities/run-tasks-in-serial");
const util_1 = require("./util");
function addJestPlugin(tree) {
    const tasks = [];
    const hasNrwlJestDependency = util_1.hasNxPackage(tree, '@nrwl/jest');
    if (!hasNrwlJestDependency) {
        const nxVersion = util_1.readNxVersion(tree);
        const installTask = devkit_1.addDependenciesToPackageJson(tree, {}, { '@nrwl/jest': nxVersion });
        tasks.push(installTask);
    }
    const jestTask = jest_1.jestInitGenerator(tree, {});
    tasks.push(jestTask);
    return run_tasks_in_serial_1.runTasksInSerial(...tasks);
}
exports.addJestPlugin = addJestPlugin;
//# sourceMappingURL=add-jest-plugin.js.map