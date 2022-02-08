"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileExecutor = void 0;
const tslib_1 = require("tslib");
const typescript_1 = require("../../utils/typescript");
const normalize_1 = require("../../utils/normalize");
const serverless_1 = require("../../utils/serverless");
const path_1 = require("path");
const devkit_1 = require("@nrwl/devkit");
function compileExecutor(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const root = normalize_1.getSourceRoot(context);
        options = normalize_1.normalizeBuildOptions(options, context.root, root);
        yield serverless_1.ServerlessWrapper.init(options, context);
        options = normalize_1.assignEntriesToFunctionsFromServerless(options, context.root);
        devkit_1.logger.info('start compiling typescript');
        const result = yield typescript_1.compileTypeScriptFiles(options, context
        // libDependencies
        ).toPromise();
        return Object.assign(Object.assign({}, result), { outfile: path_1.resolve(context.root, options.outputPath), resolverName: 'DependencyCheckResolver', tsconfig: path_1.resolve(context.root, options.tsConfig) });
    });
}
exports.compileExecutor = compileExecutor;
exports.default = compileExecutor;
//# sourceMappingURL=compile.impl.js.map