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
exports.DbTable = exports.QueryType = void 0;
const sqlite3_1 = require("sqlite3");
var QueryType;
(function (QueryType) {
    QueryType["INSERT"] = "INSERT";
    QueryType["COUNT"] = "COUNT";
    QueryType["SELECT"] = "SELECT";
})(QueryType || (exports.QueryType = QueryType = {}));
class DbTable {
    constructor(tableName, deffinition) {
        this.headers = [];
        this.table = tableName;
        this.headers = Object.keys(deffinition);
        this.deffinition = this.headers
            .reduce((ac, header) => ([
            ...ac,
            `${header} ${deffinition[header]}`,
        ]), []);
        this.db = new sqlite3_1.Database('./db/default.db', sqlite3_1.OPEN_READWRITE);
    }
    query(type, params = {}) {
        const { select, where, orderBy, groupBy, } = params;
        const headers = select || this.headers;
        const placeholders = this.placeholders(headers.length);
        switch (type) {
            case QueryType.INSERT:
                return `INSERT INTO ${this.table} (${headers.join(',')}) VALUES (${placeholders})`;
            case QueryType.COUNT:
                return `SELECT count(id) as count FROM ${this.table}`;
            default:
                const tWhere = Array.isArray(where) && where.length
                    ? `WHERE ${where.map((cond, i) => `${i > 0 ? "AND " : ""}${cond[0]} ${cond[1]} ${cond[2]}`).join(" ")}`
                    : "";
                const tOrderBy = Array.isArray(orderBy) && orderBy.length
                    ? `ORDER BY ${orderBy[0][0]} ${orderBy[0][1]}`
                    : "";
                const tGroupBy = Array.isArray(groupBy) && groupBy.length
                    ? `GROUP BY ${groupBy[0][0]}`
                    : "";
                return `SELECT ${headers.join(',')} FROM ${this.table} ${tWhere} ${tGroupBy} ${tOrderBy} LIMIT ? OFFSET ?`;
        }
    }
    placeholders(length) {
        return Array.from(Array(length)).map(() => '?').join(',');
    }
    all(params, values) {
        return new Promise((resolve, reject) => {
            const query = this.query(QueryType.SELECT, params);
            console.log(query);
            this.db.all(query, [...values], (error, result) => {
                if (error)
                    return reject(error);
                return resolve(result);
            });
        });
    }
    one(query) {
        return new Promise((resolve, reject) => {
            this.db.get(query, (error, result) => {
                if (error)
                    return reject(error);
                return resolve(result);
            });
        });
    }
    exec(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (error, result) => {
                if (error)
                    return reject(error);
                return resolve(result);
            });
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.get(this.query(QueryType.COUNT), (err, value) => {
                    if (err)
                        return reject(err);
                    return resolve(value.count);
                });
            });
        });
    }
    insert(values, columns) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.query(QueryType.INSERT, {
                select: columns
            });
            return new Promise((resolve, reject) => {
                this.db.run(query, values, (error) => {
                    if (!error)
                        return resolve();
                    return reject(error);
                });
            });
        });
    }
}
exports.DbTable = DbTable;
