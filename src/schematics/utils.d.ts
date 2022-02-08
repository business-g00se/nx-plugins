export interface BaseSchema {
    appProjectRoot: string;
    provider: string;
    region: string;
    endpointType: string;
    skipFormat: boolean;
}
export declare function getBuildConfig(options: BaseSchema): {
    executor: string;
    options: {
        outputPath: string;
        package: string;
        serverlessConfig: string;
        servicePath: string;
        tsConfig: string;
        provider: string;
        processEnvironmentFile: string;
    };
    configurations: {
        dev: {
            optimization: boolean;
            sourceMap: boolean;
            budgets: {
                type: string;
                maximumWarning: string;
                maximumError: string;
            }[];
        };
        production: {
            optimization: boolean;
            sourceMap: boolean;
            extractCss: boolean;
            namedChunks: boolean;
            extractLicenses: boolean;
            vendorChunk: boolean;
            budgets: {
                type: string;
                maximumWarning: string;
                maximumError: string;
            }[];
            fileReplacements: {
                replace: string;
                with: string;
            }[];
        };
    };
};
