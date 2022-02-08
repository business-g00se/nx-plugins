import { JsonObject } from '@angular-devkit/core';
import { ServerlessDeployBuilderOptions } from '../deploy/deploy.impl';
import { ExecutorContext } from '@nrwl/devkit';
export declare type ServerlesCompiledEvent = {
    outfile: string;
};
export declare function destroyExecutor(options: JsonObject & ServerlessDeployBuilderOptions, context: ExecutorContext): Promise<{
    success: boolean;
}>;
