"use strict";
/**
 * This example will is assuming you've already have a table create in bigquery.
 * if you'd like to create a table from your data check create-table.ts
 */
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
const __1 = require("..");
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'debug',
    transports: [
        new __1.WinstonBigQuery({
            dataset: 'logs',
            table: 'my_winston_logs'
        })
    ]
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.info('Hello World');
    }
    catch (error) {
        console.log(error);
    }
}))();
