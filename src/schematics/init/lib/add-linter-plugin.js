"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLinterPlugin = void 0;
const devkit_1 = require("@nrwl/devkit");
const util_1 = require("./util");
function addLinterPlugin(tree) {
    const hasNrwlLinterDependency = util_1.hasNxPackage(tree, '@nrwl/linter');
    if (!hasNrwlLinterDependency) {
        const nxVersion = util_1.readNxVersion(tree);
        return devkit_1.addDependenciesToPackageJson(tree, {}, {
            '@nrwl/linter': nxVersion,
        });
    }
    else {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => { };
    }
}
exports.addLinterPlugin = addLinterPlugin;
//# sourceMappingURL=add-linter-plugin.js.map