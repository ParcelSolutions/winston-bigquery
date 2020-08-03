"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_transport_1 = __importDefault(require("winston-transport"));
const bigquery_1 = require("@google-cloud/bigquery");
const env_1 = __importDefault(require("./commons/env"));
const lodash_1 = require("lodash");
const dotenv_1 = __importDefault(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const flat_1 = __importDefault(require("flat"));
const lodash_2 = __importDefault(require("lodash"));
const delay_1 = require("./commons/delay");
class WinstonBigQuery extends winston_transport_1.default {
    constructor(options) {
        super();
        dotenv_1.default.config();
        this.options = lodash_2.default.extend({}, {
            create: false,
            schema: null,
            timeout: 20 * 1000
        }, options);
        if (lodash_1.isEmpty(options.dataset)) {
            throw new Error("Missing required 'datasetId' in construction");
        }
        if (lodash_1.isEmpty(options.table)) {
            throw new Error("Missing required 'tableId' in construction");
        }
        const envGoogleAppCred = env_1.default.getEnvVariable('GOOGLE_APPLICATION_CREDENTIALS');
        const envServiceAccount = env_1.default.getEnvVariable('SERVICE_ACCOUNT');
        const { applicationCredentials } = this.options;
        const credentialsJsonPath = applicationCredentials || envGoogleAppCred || envServiceAccount;
        if (env_1.default.isDevelopment() || env_1.default.isTest()) {
            console.log(`loading credentials from ${credentialsJsonPath}`);
        }
        // if using a env var containing creds
        if (process.env.GOOGLE_CREDENTIALS) {
            const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}");
            this.bigquery = new bigquery_1.BigQuery({
                credentials: credentials,
                projectId: (credentials || {}).project_id
            });
        }
        else {
            this.bigquery = new bigquery_1.BigQuery({
                keyFile: applicationCredentials
            });
        }
        const { create } = this.options;
        if (create) {
            this.createTable().then(() => {
                this.isInitialized = true;
            });
        }
        else {
            this.isInitialized = true;
        }
    }
    getTableSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dataset, table } = this.options;
            const meta = (yield this.bigquery
                .dataset(dataset)
                .table(table)
                .getMetadata())[0];
            const schema = meta.schema.fields.reduce((acc, { name, type }) => {
                acc[name] = type.toLowerCase();
                return acc;
            }, {});
            return schema;
        });
    }
    createTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dataset, table, schema } = this.options;
            const mandatorySchemaFields = {
                timestamp: 'timestamp',
                level: 'string',
                message: 'string',
                meta: 'string'
            };
            const userSchemaFields = flat_1.default(lodash_1.omit(schema, Object.keys(mandatorySchemaFields)), {
                delimiter: '_'
            });
            const mergedSchema = Object.assign(Object.assign({}, mandatorySchemaFields), userSchemaFields);
            const shorthandMergedSchema = Object.entries(mergedSchema)
                .map(([name, type]) => `${name}:${type}`)
                .join(',');
            this.schema = mergedSchema;
            yield this.bigquery.dataset(dataset).createTable(table, {
                schema: shorthandMergedSchema
            });
        });
    }
    log(info, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dataset, table, timeout } = this.options;
            if (!this.isInitialized) {
                yield delay_1.delay(timeout);
                if (!this.isInitialized)
                    throw new Error(`connection is not initialized after ${timeout}ms , consider increasing 'timeout' option`);
            }
            if (!this.schema) {
                const schema = yield this.getTableSchema();
                this.options.schema = schema;
            }
            const flatInfo = flat_1.default(Object.assign({ timestamp: moment_1.default()
                    .utc()
                    .format() }, info), {
                delimiter: '_'
            });
            const schemaFields = lodash_2.default.pick(flatInfo, Object.keys(this.options.schema));
            const metaField = lodash_2.default.omit(flatInfo, Object.keys(this.options.schema));
            const flatNormalizedInfo = Object.assign(Object.assign({}, schemaFields), { meta: lodash_2.default.isEmpty(metaField) ? null : JSON.stringify(metaField) });
            const r = yield this.bigquery
                .dataset(dataset)
                .table(table)
                .insert(flatNormalizedInfo);
            next();
        });
    }
}
exports.WinstonBigQuery = WinstonBigQuery;
