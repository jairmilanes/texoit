import {Database, OPEN_READWRITE} from "sqlite3"
import {QueryParams} from "../types";

export enum QueryType {
    INSERT = "INSERT",
    COUNT = "COUNT",
    SELECT = "SELECT"
}

export class DbTable<T> {

    db: Database;
    table: string;
    headers: string[] = []
    deffinition: string[]

    constructor(tableName: string, deffinition: Record<string, string>) {
        this.table = tableName;
        this.headers = Object.keys(deffinition)
        this.deffinition = this.headers
            .reduce((ac: string[], header) => ([
                ...ac,
                `${header} ${deffinition[header]}`,
            ]), []);
        this.db = new Database('./db/default.db', OPEN_READWRITE);
    }

    query(type: QueryType, params: QueryParams = {}) {
        const { select, where, orderBy, groupBy,} = params
        const headers = select || this.headers;
        const placeholders = this.placeholders(headers.length)
        switch(type) {
            case QueryType.INSERT:
                return `INSERT INTO ${this.table} (${headers.join(',')}) VALUES (${placeholders})`;
            case QueryType.COUNT:
                return `SELECT count(id) as count FROM ${this.table}`;
            default:
                const tWhere = Array.isArray(where) && where.length
                    ? `WHERE ${where.map((cond, i) => `${i > 0 ? "AND " : ""}${cond[0]} ${cond[1]} ${cond[2]}`).join(" ")}`
                    : ""
                const tOrderBy = Array.isArray(orderBy) && orderBy.length
                    ? `ORDER BY ${orderBy[0][0]} ${orderBy[0][1]}`
                    : "";
                const tGroupBy = Array.isArray(groupBy) && groupBy.length
                    ? `GROUP BY ${groupBy[0][0]}`
                    : "";
                return `SELECT ${headers.join(',')} FROM ${this.table} ${tWhere} ${tGroupBy} ${tOrderBy} LIMIT ? OFFSET ?`;
        }
    }

    placeholders(length: number): string {
        return Array.from(Array(length)).map(() => '?').join(',')
    }

    all(params: QueryParams, values: Array<string | number | boolean | undefined>): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const query = this.query(QueryType.SELECT, params)
            console.log(query)
            this.db.all(query, [...values],(error, result: T[]) => {
                if (error) return reject(error)
                return resolve(result)
            })
        })
    }

    one(query: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.get(query, (error, result: T[]) => {
                if (error) return reject(error)
                return resolve(result)
            })
        })
    }

    exec<T>(query: string, params: Array<string | number | boolean> = []): Promise<T> {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (error, result: T) => {
                if (error) return reject(error)
                return resolve(result)
            })
        })
    }

    async count(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.get(
                this.query(QueryType.COUNT),
                (err: Error | null, value: any) => {
                    if (err) return reject(err)
                    return resolve(value.count)
                })
        })
    }

    async insert(values: string[], columns?: string[]): Promise<void> {
        const query = this.query(QueryType.INSERT, {
            select: columns
        })
        return new Promise((resolve, reject) => {
            this.db.run(query, values, (error: Error | null) => {
                if (!error) return resolve()
                return reject(error)
            })
        })
    }
}