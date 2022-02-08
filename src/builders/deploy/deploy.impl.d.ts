import { JsonObject } from '@angular-devkit/core';
import { Packager } from '../../utils/enums';
import { ExecutorContext } from '@nrwl/devkit';
import { ServerlessSlsBuilderOptions } from '../sls/sls.impl';
import { ScullyBuilderOptions } from '../scully/scully.impl';
export declare const enum InspectType {
    Inspect = "inspect",
    InspectBrk = "inspect-brk"
}
export interface ServerlessDeployBuilderOptions extends JsonObject {
    inspect: boolean | InspectType;
    waitUntilTargets: string[];
    buildTarget: string;
    host: string;
    port: number;
    watch: boolean;
    package: string;
    location: string;
    stage: string;
    list: boolean;
    updateConfig: boolean;
    function?: string;
    verbose?: boolean;
    sourceRoot?: string;
    root?: string;
    ignoreScripts: boolean;
    packager?: Packager;
    serverlessPackagePath?: string;
    args?: string;
}
export declare function deployExecutor(options: JsonObject & ServerlessDeployBuilderOptions, context: ExecutorContext): Promise<{
    success: boolean;
}>;
export declare function buildTarget(options: (JsonObject & ServerlessDeployBuilderOptions) | (JsonObject & ServerlessSlsBuilderOptions) | (JsonObject & ScullyBuilderOptions), context: ExecutorContext): AsyncGenerator<import("@angular-devkit/architect").BuilderOutput, void, unknown>;
export default deployExecutor;
