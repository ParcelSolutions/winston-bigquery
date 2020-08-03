declare type EnvName = 'production' | 'development' | 'ci' | 'test';
declare const _default: {
    isProduction: () => boolean;
    isCI: () => boolean;
    isDevelopment: () => boolean;
    isTest: () => boolean;
    getEnvironment: () => EnvName;
    setEnvironment: (envName: EnvName) => string;
    setEnvVariable: (name: string, value: string) => string;
    getEnvVariable: (name: string) => string;
    unsetEnvVariable: (name: string) => string;
};
export default _default;
