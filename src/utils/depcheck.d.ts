import * as depcheck from 'depcheck';
import { DependencyResolver } from './types';
import { Observable } from 'rxjs';
import { ExecutorContext } from '@nrwl/devkit';
import { Stats } from 'webpack';
export declare class DependencyCheckResolver implements DependencyResolver {
    private context;
    options: {
        ignoreBinPackage: boolean;
        skipMissing: boolean;
        ignoreDirs: string[];
        ignoreMatches: string[];
        parsers: {};
        detectors: depcheck.Detector[];
        specials: depcheck.Parser[];
        package: {};
    };
    constructor(context: ExecutorContext);
    normalizeExternalDependencies(packageJson: any, originPackageJsonPath: string, verbose: boolean, webpackStats?: Stats.ToJsonOutput, dependencyGraph?: any, sourceRoot?: string, tsconfig?: string): Observable<string[]>;
    dependencyCheck(packageJson: any, sourceRoot: string, tsconfig: string): Observable<depcheck.Results>;
}
