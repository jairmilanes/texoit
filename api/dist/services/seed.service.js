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
exports.SeedService = void 0;
const spinner_service_1 = __importDefault(require("./spinner.service"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const csv_parse_1 = require("csv-parse");
class SeedService {
    constructor(filePath, model) {
        this.throttle = 5;
        this.file = path_1.default.resolve(path_1.default.join("./seed", filePath));
        this.model = model;
    }
    drop() {
        return new Promise((resolve, reject) => {
            this.model.db.run(`DROP TABLE IF EXISTS movies`, (error) => {
                if (error)
                    return reject(error);
                return resolve();
            });
        });
    }
    createTable() {
        return new Promise((resolve, reject) => {
            spinner_service_1.default.text = 'Creatging table...';
            this.model.db.serialize(() => {
                const definitions = this.model.deffinition.join(",\r\n");
                const query = `
                    CREATE TABLE IF NOT EXISTS movies (
                        id INTEGER PRIMARY KEY,
                        ${definitions}
                    )`;
                const onResponse = (error) => {
                    if (!error) {
                        spinner_service_1.default.text = 'Table created successfully';
                        return resolve();
                    }
                    spinner_service_1.default.text = error.message;
                    return reject(error);
                };
                this.model.db.run(query, onResponse);
            });
        });
    }
    wait(mili) {
        return new Promise((resolve) => setTimeout(resolve, mili));
    }
    createParser() {
        return (0, fs_1.createReadStream)(this.file)
            .pipe((0, csv_parse_1.parse)({ delimiter: ';' }));
    }
    seed(onRow) {
        return __awaiter(this, void 0, void 0, function* () {
            spinner_service_1.default.prefixText = 'Seeding data, please hold...';
            const data = [];
            return new Promise((resolve, reject) => {
                const parser = this.createParser();
                parser
                    .on('readable', () => __awaiter(this, void 0, void 0, function* () {
                    let row;
                    let count = 0;
                    while ((row = parser.read()) !== null) {
                        try {
                            if (!count) {
                                count++;
                                continue;
                            }
                            spinner_service_1.default.text = "Row " + count;
                            if (typeof onRow === "function") {
                                yield onRow(row, data);
                            }
                            else {
                                yield this.model.insert(row);
                                data.push(row);
                                yield this.wait(this.throttle);
                            }
                        }
                        catch (e) {
                            console.error(e);
                            throw e;
                        }
                        count++;
                    }
                }))
                    .on('end', () => resolve(data))
                    .on("error", reject);
            });
        });
    }
}
exports.SeedService = SeedService;
