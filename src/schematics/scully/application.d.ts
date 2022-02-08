import { Schema } from './schema';
import { Tree } from '@nrwl/devkit';
export declare function scullyAppGenerator(host: Tree, schema: Schema): Promise<void>;
export default scullyAppGenerator;
export declare const scullyAppSchematic: (options: Schema) => (tree: any, context: any) => Promise<any>;
