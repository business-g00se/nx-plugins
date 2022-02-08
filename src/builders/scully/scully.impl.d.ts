import { JsonObject } from '@angular-devkit/core';
import { ExecutorContext } from '@nrwl/devkit';
export interface ScullyBuilderOptions extends JsonObject {
    buildTarget: string;
    skipBuild: boolean;
    configFiles: string[];
    showGuessError?: boolean;
    showBrowser?: boolean;
    removeStaticDist?: boolean;
    baseFilter?: string;
    proxy?: string;
    open?: boolean;
    scanRoutes?: boolean;
    highlight?: boolean;
}
export declare function scullyCmdRunner(options: JsonObject & ScullyBuilderOptions, context: ExecutorContext): Promise<{
    success: boolean;
}>;
export default scullyCmdRunner;
