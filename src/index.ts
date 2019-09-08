import Transport from 'winston-transport';
import {BigQuery} from '@google-cloud/bigquery';
import env from './commons/env';
import {isEmpty, omit} from 'lodash';
import dotenv from 'dotenv';
import moment from 'moment';
import flatten from 'flat';
import _ from 'lodash';

type BigQuerySchemaTypes =
	| 'string'
	| 'integer'
	| 'float'
	| 'boolean'
	| 'timestamp';

type SchemaRecord = {
	[n: string]: BigQuerySchemaTypes | SchemaRecord;
};

interface WinstonBigQueryOptions {
	datasetId: string;
	tableId: string;
	applicationCredentials?: string;
	schema?: SchemaRecord;
	dropCreate?: boolean;
}

export class WinstonBigQuery extends Transport {
	bigquery: BigQuery;
	options: WinstonBigQueryOptions;

	private isSchemaVerified: boolean;

	constructor(options: WinstonBigQueryOptions) {
		super();
		dotenv.config();

		this.bigquery = new BigQuery();

		if (isEmpty(options.datasetId)) {
			throw new Error("Missing required 'datasetId' in construction");
		}

		if (isEmpty(options.tableId)) {
			throw new Error("Missing required 'tableId' in construction");
		}

		if (
			isEmpty(env.getEnvVariable('GOOGLE_APPLICATION_CREDENTIALS')) &&
			isEmpty(options.applicationCredentials)
		) {
			throw new Error(
				'Missing required GOOGLE_APPLICATION_CREDENTIALS, please add it as to construction object or as enviroment variable. read more here : http://bit.ly/2k0D1cj '
			);
		}

		if (env.isDevelopment() || env.isTest()) {
			console.log(
				`loading GOOGLE_APPLICATION_CREDENTIALS from ${env.getEnvVariable(
					'GOOGLE_APPLICATION_CREDENTIALS'
				)}`
			);
		}

		this.options = _.extend({}, {dropCreate: false, schema: null}, options);

		const {dropCreate} = this.options;

		if (dropCreate) {
			this.dropCreateTable();
		}
	}

	async dropCreateTable() {
		const {datasetId, tableId, schema} = this.options;

		try {
			await this.bigquery
				.dataset(datasetId)
				.table(tableId)
				.delete();
			// eslint-disable-next-line no-empty
		} catch (e) {}

		const mandatorySchemaFields = {
			timestamp: 'timestamp',
			level: 'string',
			message: 'string'
		};

		const userSchemaFields = flatten(
			omit(schema, Object.keys(mandatorySchemaFields)),
			{
				delimiter: '_'
			}
		);

		const mergedSchema = Object.entries({
			...mandatorySchemaFields,
			...userSchemaFields
		})
			.map(([name, type]) => `${name}:${type}`)
			.join(',');

		await this.bigquery.dataset(datasetId).createTable(tableId, {
			schema: mergedSchema as any
		});
	}

	async log(info: any, next?: () => void) {
		const {datasetId, tableId} = this.options;

		const flatInfo = flatten(
			{
				timestamp: moment()
					.utc()
					.format(),
				...info
			},
			{
				delimiter: '_'
			}
		);

		try {
			const r = await this.bigquery
				.dataset(datasetId)
				.table(tableId)
				.insert(flatInfo);

			console.log(r);
		} catch (e) {
			console.log(e.errors[0]);
		}

		next();
	}
}
