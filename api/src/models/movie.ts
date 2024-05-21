import {DbTable} from "../services/db-table.service";

export class Movie {
    id: string = "";
    year: number = 2000;
    title: string = "";
    studios: string = "";
    producers: string = "";
    winner: string = "";

    constructor(data: Record<string, string | number>) {
        const carKeys = Object.keys(this);
        carKeys.forEach((key, i) => {
            if (key in data) {
                this.set(key, data[key])
            }
        })
    }

    set(key: string, value: string | number) {
        // @ts-ignore
        this[key] = value;
        return this;
    }
}

export class MovieTable extends DbTable<Movie> {
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