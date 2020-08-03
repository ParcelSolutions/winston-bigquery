"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
process.env.NODE_ENV = lodash_1.default.get(process.env, 'NODE_ENV', 'development');
const isDevelopment = () => process.env.NODE_ENV === 'development';
const isCI = () => process.env.NODE_ENV === 'ci';
const isTest = () => process.env.NODE_ENV === 'test';
const isProduction = () => process.env.NODE_ENV === 'production';
const setEnvVariable = (name, value) => (process.env[name] = value);
const unsetEnvVariable = (name) => setEnvVariable(name, null);
const getEnvVariable = (name) => process.env[name];
const getEnvironment = () => process.env.NODE_ENV || 'development';
const setEnvironment = (envName) => setEnvVariable('NODE_ENV', envName);
exports.default = {
    isProduction,
    isCI,
    isDevelopment,
    isTest,
    getEnvironment,
    setEnvironment,
    setEnvVariable,
    getEnvVariable,
    unsetEnvVariable
};
