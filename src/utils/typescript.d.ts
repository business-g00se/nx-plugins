import { BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { ServerlessCompileOptions } from './types';
import { ExecutorContext } from '@nrwl/devkit';
export declare function compileTypeScriptFiles(options: ServerlessCompileOptions, context: ExecutorContext): Observable<BuilderOutput>;
