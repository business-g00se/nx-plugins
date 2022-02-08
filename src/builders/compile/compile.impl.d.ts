import { JsonObject } from '@angular-devkit/core';
import { ServerlessCompileOptions } from '../../utils/types';
import { ExecutorContext } from '@nrwl/devkit';
export declare type ServerlesCompiledEvent = {
    outfile: string;
};
export declare function compileExecutor(options: JsonObject & ServerlessCompileOptions, context: ExecutorContext): Promise<{
    outfile: string;
    resolverName: string;
    tsconfig: string;
    error?: string;
    info?: {
        [key: string]: any;
    };
    success: boolean;
    target?: import("@angular-devkit/architect/src/output-schema").Target;
}>;
export default compileExecutor;
