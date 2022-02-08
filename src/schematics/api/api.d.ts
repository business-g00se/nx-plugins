import { Tree } from '@nrwl/devkit';
import { Schema } from './schema';
export declare function apiGenerator(host: Tree, schema: Schema): Promise<void>;
export default apiGenerator;
export declare const apiSchematic: (options: Schema) => (tree: any, context: any) => Promise<any>;
