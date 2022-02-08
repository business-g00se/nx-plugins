import { JsonObject } from '@angular-devkit/core';
import { BuildResult } from '@angular-devkit/build-webpack';
import { BuildBuilderOptions, ServerlessEventResult } from '../../utils/types';
import { ExecutorContext } from '@nrwl/devkit';
export interface BuildServerlessBuilderOptions extends BuildBuilderOptions {
}
export declare type ServerlessBuildEvent = BuildResult & ServerlessEventResult & {
    outfile: string;
    success: boolean;
};
export declare function buildExecutor(options: JsonObject & BuildServerlessBuilderOptions, context: ExecutorContext): Promise<ServerlessBuildEvent>;
export default buildExecutor;
export declare const serverlessBuilder: any;
