"use strict";
/**
 * This example will generate the big query table from the structure of the schema field in options.
 * deep nested fields will be translated to a flat string representation with "_" delimiter.
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
const __1 = require("../");
const winston_1 = __importDefault(require("winston"));
const delay_1 = require("../commons/delay");
const logger = winston_1.default.createLogger({
    level: 'debug',
    transports: [
        new __1.WinstonBigQuery({
            dataset: 'logs',
            table: 'my_winston_logs',
            schema: {
                timestamp: 'timestamp',
                firstName: 'string',
                lastName: 'string',
                session: {
                    userId: 'integer'
                }
            },
            create: true
        })
    ]
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield delay_1.delay(3 * 1000);
        logger.debug('Round kick from chuck! Bam!', {
            session: {
                userId: 1
            },
            firstName: 'chuck',
            lastName: 'norris'
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
