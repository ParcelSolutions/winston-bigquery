"use strict";
/**
 * This example will is assuming you've already have a table create in bigquery.
 * we will see how a deeply nested unknown field which are not part of the schmea
 * are auto injected in to the "meta" field
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
        logger.info('Hello World', {
            character: {
                name: 'mister meesiks',
                hobbies: 'hey! look at me!'
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
