"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieTable = exports.Movie = void 0;
const db_table_service_1 = require("../services/db-table.service");
class Movie {
    constructor(data) {
        this.id = "";
        this.year = 2000;
        this.title = "";
        this.studios = "";
        this.producers = "";
        this.winner = "";
        const carKeys = Object.keys(this);
        carKeys.forEach((key, i) => {
            if (key in data) {
                this.set(key, data[key]);
            }
        });
    }
    set(key, value) {
        // @ts-ignore
        this[key] = value;
        return this;
    }
}
exports.Movie = Movie;
class MovieTable extends db_table_service_1.DbTable {
    constructor() {
        super("movies", {
            year: "INTEGER",
            title: "TEXT",
            studios: "TEXT",
            producers: "TEXT",
            winner: "TEXT",
        });
    }
}
exports.MovieTable = MovieTable;
