import { BuilderOutput } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { ExecutorContext } from '@nrwl/devkit';
export declare const enum InspectType {
    Inspect = "inspect",
    InspectBrk = "inspect-brk"
}
export interface ServerlessExecuteBuilderOptions extends JsonObject {
    inspect: boolean | InspectType;
    waitUntilTargets: string[];
    buildTarget: string;
    watch: boolean;
    args: string[];
    runtimeArgs: string[];
    verbose?: boolean;
    binPath?: string;
    host?: string;
    location?: string;
    noAuth?: boolean;
    noEnvironment?: boolean;
    port?: number;
    region?: string;
    printOutput?: boolean;
    preserveTrailingSlash?: boolean;
    stage?: string;
    useSeparateProcesses?: boolean;
    websocketPort?: number;
    prefix?: string;
    hideStackTraces?: boolean;
    corsAllowHeaders?: string;
    corsAllowOrigin?: string;
    corsDisallowCredentials?: string;
    corsExposedHeaders?: string;
    disableCookieValidation?: boolean;
    enforceSecureCookies?: boolean;
    exec?: string;
    readyWhen: string;
}
export declare function offlineExecutor(options: JsonObject & ServerlessExecuteBuilderOptions, context: ExecutorContext): AsyncGenerator<BuilderOutput, {
    success: boolean;
}, unknown>;
export default offlineExecutor;
