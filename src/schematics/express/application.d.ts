import { Schema } from './schema';
import { Tree } from '@nrwl/devkit';
export declare function expressApiGenerator(host: Tree, schema: Schema): Promise<void>;
export default expressApiGenerator;
export declare const expressApiSchematic: (options: Schema) => (tree: any, context: any) => Promise<any>;
