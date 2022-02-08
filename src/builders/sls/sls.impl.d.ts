import { JsonObject } from '@angular-devkit/core';
import { Packager } from '../../utils/enums';
import { ExecutorContext } from '@nrwl/devkit';
export declare const enum InspectType {
    Inspect = "inspect",
    InspectBrk = "inspect-brk"
}
export interface ServerlessSlsBuilderOptions extends JsonObject {
    inspect: boolean | InspectType;
    waitUntilTargets: string[];
    buildTarget: string;
    host: string;
    port: number;
    watch: boolean;
    package: string;
    location: string;
    stage: string;
    verbose?: boolean;
    sourceRoot?: string;
    root?: string;
    command: string;
    ignoreScripts: boolean;
    packager?: Packager;
    serverlessPackagePath?: string;
    args?: string;
}
export declare function slsExecutor(options: JsonObject & ServerlessSlsBuilderOptions, context: ExecutorContext): Promise<{
    success: boolean;
}>;
