"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestUILib = exports.callRule = exports.runSchematic = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const testing_1 = require("@nrwl/workspace/testing");
const schematics_1 = require("@angular-devkit/schematics");
const testing_2 = require("@angular-devkit/schematics/testing");
const testRunner = new testing_2.SchematicTestRunner('@flowaccount/nx-serverless', path_1.join(__dirname, '../../collection.json'));
function runSchematic(schematicName, options, tree) {
    return testRunner.runSchematicAsync(schematicName, options, tree).toPromise();
}
exports.runSchematic = runSchematic;
function callRule(rule, tree) {
    return testRunner.callRule(rule, tree).toPromise();
}
exports.callRule = callRule;
// export async function getMockContext() {
//   const registry = new schema.CoreSchemaRegistry();
//   registry.addPostTransform(schema.transforms.addUndefinedDefaults);
//   const architectHost = new TestingArchitectHost('/root', '/root');
//   const architect = new Architect(architectHost, registry);
//   await architectHost.addBuilderFromPackage(join(__dirname, '../..'));
//   const context = new MockBuilderContext(architect, architectHost);
//   await context.addBuilderFromPackage(join(__dirname, '../..'));
//   await context.addTarget({ project: 'test', target: 'test' }, 'build');
//   return [architect, context] as [Architect, MockBuilderContext];
// }
function createTestUILib(libName, buildable = true) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let appTree = testing_1.createEmptyWorkspace(schematics_1.Tree.empty());
        appTree = yield callRule(schematics_1.externalSchematic('@flowaccount/nx-serverless', 'library', {
            name: libName,
            buildable,
        }), appTree);
        return appTree;
    });
}
exports.createTestUILib = createTestUILib;
//# sourceMappingURL=testing.js.map