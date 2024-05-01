"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const rotating_file_stream_1 = __importDefault(require("rotating-file-stream"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// log directory path
const logDirectory = path_1.default.resolve(__dirname, '../../log');
// ensure log directory exists
fs_1.default.existsSync(logDirectory) || fs_1.default.mkdirSync(logDirectory);
// create a rotating write stream
const accessLogStream = rotating_file_stream_1.default('access.log', {
    interval: '1d',
    path: logDirectory
});
exports.default = {
    dev: morgan_1.default('dev'),
    combined: morgan_1.default('combined', { stream: accessLogStream })
};
