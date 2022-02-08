import { ExecutorContext } from '@nrwl/devkit';
import { ServerlessExecuteBuilderOptions } from './offline.impl';
export declare function serverlessOfflineExecutor(options: ServerlessExecuteBuilderOptions, context: ExecutorContext): AsyncGenerator<{
    success: boolean;
    baseUrl: string;
}, {
    success: boolean;
}, unknown>;
export default serverlessOfflineExecutor;
