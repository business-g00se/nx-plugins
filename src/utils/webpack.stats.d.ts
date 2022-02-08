import { DependencyResolver } from './types';
import { ExecutorContext } from '@nrwl/devkit';
import { Stats } from 'webpack';
export declare class WebpackDependencyResolver implements DependencyResolver {
    private context;
    constructor(context: ExecutorContext);
    normalizeExternalDependencies(packageJson: any, originPackageJsonPath: string, verbose: boolean, webpackStats?: Stats.ToJsonOutput, dependencyGraph?: any, sourceRoot?: string, tsconfig?: string): import("rxjs").Observable<string[]>;
    isExternalModule(module: any): boolean;
    getExternalModuleName(module: any): string;
    getExternalModules(stats: Stats.ToJsonOutput): unknown[];
}
