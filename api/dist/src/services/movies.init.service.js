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
exports.moviewsInit = void 0;
const movie_1 = require("../models/movie");
const seed_service_1 = require("./seed.service");
const spinner_service_1 = __importDefault(require("./spinner.service"));
function moviewsInit(seedFilename_1) {
    return __awaiter(this, arguments, void 0, function* (seedFilename, drop = false) {
        const movies = new movie_1.MovieTable();
        const seed = new seed_service_1.SeedService(seedFilename, movies);
        if (drop) {
            yield seed.drop();
            yield seed.createTable();
            yield seed.seed((row, data) => __awaiter(this, void 0, void 0, function* () {
                const producerIdx = row.length - 2;
                const producerColumn = row[producerIdx];
                const producers = producerColumn
                    .split(",")
                    .reduce((ac, p) => ([
                    ...ac,
                    ...p.trim().split(" and ").map(s => s.trim())
                ]), []);
                for (let i = 0; i < producers.length; i++) {
                    row[producerIdx] = producers[i];
                    spinner_service_1.default.prefixText = row[producerIdx];
                    yield movies.insert(row);
                    data.push(row);
                    yield seed.wait(5);
                }
            }));
        }
        return movies.count();
    });
}
exports.moviewsInit = moviewsInit;
