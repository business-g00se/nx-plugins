import { BuilderOutput } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { ExecutorContext } from '@nrwl/devkit';
export declare function runWaitUntilTargets(waitUntilTargets: string[], context: ExecutorContext): Promise<{
    success: boolean;
}[]>;
export declare function startBuild(options: {
    buildTarget: string;
} & JsonObject, context: ExecutorContext): AsyncGenerator<BuilderOutput, void, undefined>;
