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
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const range_service_1 = require("./services/range.service");
const movie_1 = require("./models/movie");
const constants_1 = require("./constants");
(0, dotenv_1.config)({
    path: `.env.${process.env.NODE_ENV}`,
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        message: "Alive!"
    });
}));
app.get("/movies", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q, page: currentPage, year, winner, orderBy: order, limit, offset } = req.query;
        const movies = new movie_1.MovieTable();
        const orderBy = (order || "title_ASC")
            .split(",")
            .map(pr => pr.split("_"));
        const count = yield movies.count();
        const _limit = parseInt(limit || "0") || constants_1.DEFAULT_LIMIT;
        const _offset = currentPage
            ? (currentPage * _limit) - _limit
            : parseInt(offset || "0") || constants_1.DEFAULT_OFFSET;
        const page = currentPage || (_offset / _limit) + 1;
        const pages = Math.ceil(count / (_limit));
        const next = page < pages ? page + 1 : null;
        const prev = page > 1 ? page - 1 : null;
        const values = [];
        const where = [];
        if (year) {
            where.push(["year", "=", "?"]);
            values.push(year);
        }
        if (winner) {
            where.push(["winner", "=", "?"]);
            values.push(winner === "yes" ? winner : '');
        }
        if (q) {
            where.push(["title", "=", "?"]);
            values.push(q);
        }
        values.push(_limit);
        values.push(_offset);
        const results = yield movies.all({
            select: ["*"],
            where,
            orderBy,
            limit: "?",
            offset: "?"
        }, values);
        res.json({
            items: results,
            page,
            pages,
            next,
            prev,
            count,
            limit: _limit,
            offset: _offset
        });
    }
    catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}));
app.get("/winners/by-year", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, offset } = req.query;
        const movies = new movie_1.MovieTable();
        const values = [];
        values.push("yes");
        values.push(limit || 10);
        values.push(offset || 0);
        const results = yield movies.all({
            select: ["year", "count(id) as winners"],
            where: [
                ["winner", "=", "?"]
            ],
            groupBy: [
                ["year"]
            ],
            orderBy: [
                ["winners", "DESC"]
            ],
            limit: "?",
            offset: "?"
        }, values);
        res.json(results);
    }
    catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}));
app.get("/studios/top-three", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = new movie_1.MovieTable();
        const values = [];
        values.push("yes");
        values.push(3);
        values.push(0);
        const results = yield movies.all({
            select: ["studios", "count(id) as winners"],
            where: [
                ["winner", "=", "?"]
            ],
            groupBy: [
                ["studios"]
            ],
            orderBy: [
                ["winners", "DESC"]
            ],
            limit: "?",
            offset: "?"
        }, values);
        res.json(results);
    }
    catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}));
app.get("/movie/by-year", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, limit } = req.query;
        const movies = new movie_1.MovieTable();
        const values = [];
        values.push("yes");
        values.push(year);
        values.push(limit || 10);
        values.push(0);
        const results = yield movies.all({
            select: ["id", "year", "title"],
            where: [
                ["winner", "=", "?"],
                ["year", "=", "?"]
            ],
            orderBy: [
                ["year", "DESC"]
            ],
            limit: "?",
            offset: "?"
        }, values);
        res.json(results);
    }
    catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}));
app.get("/winners/range", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const min = yield (0, range_service_1.getLowestInterval)();
        const max = yield (0, range_service_1.getHighestInterval)();
        const results = {
            min: yield (0, range_service_1.getInterval)(min),
            max: yield (0, range_service_1.getInterval)(max)
        };
        res.json(results);
    }
    catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}));
exports.default = app;
