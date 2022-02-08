import { ServerlessBaseOptions } from './types';
import { ServerlessDeployBuilderOptions } from '../builders/deploy/deploy.impl';
import { ServerlessSlsBuilderOptions } from '../builders/sls/sls.impl';
import { ExecutorContext } from '@nrwl/devkit';
import { JsonObject } from '@angular-devkit/core';
export declare class ServerlessWrapper {
    constructor();
    private static serverless$;
    static get serverless(): any;
    static isServerlessDeployBuilderOptions(arg: any): arg is ServerlessDeployBuilderOptions;
    static init(options: ServerlessBaseOptions | ServerlessDeployBuilderOptions, context: ExecutorContext): Promise<void>;
}
export declare function getExecArgv(options: ServerlessDeployBuilderOptions | ServerlessSlsBuilderOptions): any[];
export declare function runServerlessCommand(options: (JsonObject & ServerlessDeployBuilderOptions) | (JsonObject & ServerlessSlsBuilderOptions), commands: string[], extraArgs?: string[]): Promise<void>;
export declare function makeDistFileReadyForPackaging(options: (JsonObject & ServerlessDeployBuilderOptions) | (JsonObject & ServerlessSlsBuilderOptions)): Promise<void>;
