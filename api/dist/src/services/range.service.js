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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterval = exports.getHighestInterval = exports.getLowestInterval = void 0;
const movie_1 = require("../models/movie");
function adgeQuery(operator) {
    return `
        with lowest as (
            SELECT 
                year - (LAG(year) OVER (PARTITION BY producers ORDER BY year)) AS interval
            FROM 
                movies
            WHERE
                winner = "yes"
            ORDER BY 
                interval ASC
            )
            SELECT
                ${operator}(lowest.interval) as interval
            FROM lowest
            ORDER BY 
                lowest.interval ASC`;
}
function getLowestInterval() {
    return __awaiter(this, void 0, void 0, function* () {
        const movies = new movie_1.MovieTable();
        try {
            const result = yield movies.exec(adgeQuery("min"));
            return result[0].interval;
        }
        catch (e) {
            console.error(e);
            throw new Error("Query for lowest interval failed.");
        }
    });
}
exports.getLowestInterval = getLowestInterval;
function getHighestInterval() {
    return __awaiter(this, void 0, void 0, function* () {
        const movies = new movie_1.MovieTable();
        try {
            const result = yield movies.exec(adgeQuery("max"));
            return result[0].interval;
        }
        catch (e) {
            console.error(e);
            throw new Error("Query for highest interval failed.");
        }
    });
}
exports.getHighestInterval = getHighestInterval;
function getInterval(interval) {
    const query = `
        WITH q as (
            SELECT 
                id, 
                producers, 
                LAG(year) OVER (PARTITION BY producers ORDER BY year) as previousWin,
                year as followingWin, 
                year - (LAG(year) OVER (PARTITION BY producers ORDER BY year)) AS interval
            FROM 
                movies
            WHERE
                winner = "yes"
            ORDER BY 
                interval DESC
            )
        SELECT q.*
        FROM q
        WHERE 
            q.interval = ?
        ORDER BY 
            q.interval DESC`;
    const movies = new movie_1.MovieTable();
    try {
        return movies.exec(query, [interval]);
    }
    catch (e) {
        console.error(e);
        throw new Error("Interval query failed.");
    }
}
exports.getInterval = getInterval;
