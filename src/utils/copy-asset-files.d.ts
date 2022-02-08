import { BuilderOutput } from '@angular-devkit/architect';
import { ServerlessSlsBuilderOptions } from '../builders/sls/sls.impl';
import { ServerlessDeployBuilderOptions } from '../builders/deploy/deploy.impl';
import { BuildBuilderOptions } from './types';
export default function copyAssetFiles(options: BuildBuilderOptions): Promise<BuilderOutput>;
export declare function copyAssetFilesSync(options: BuildBuilderOptions): BuilderOutput;
export declare function copyBuildOutputToBePackaged(options: ServerlessDeployBuilderOptions | ServerlessSlsBuilderOptions): Promise<BuilderOutput>;
export declare function parseArgs(options: ServerlessDeployBuilderOptions | ServerlessSlsBuilderOptions): {};
