"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));
