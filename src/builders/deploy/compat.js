"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const deploy_impl_1 = require("./deploy.impl");
exports.default = devkit_1.convertNxExecutor(deploy_impl_1.deployExecutor);
//# sourceMappingURL=compat.js.map