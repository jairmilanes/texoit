import {RangeEntry} from "../types";
import { MovieTable } from "../models/movie"

function adgeQuery(operator: "min" | "max") {
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

export async function getLowestInterval(): Promise<number> {
    const movies = new MovieTable()

    try {
        const result = await movies.exec<{ interval: number }[]>(adgeQuery("min"))
        return result[0].interval
    } catch(e) {
        console.error(e)
        throw new Error("Query for lowest interval failed.")
    }
}

export async function getHighestInterval(): Promise<number> {
    const movies = new MovieTable()
    try {
        const result = await movies.exec<{ interval: number }[]>(adgeQuery("max"))
        return result[0].interval
    } catch(e) {
        console.error(e)
        throw new Error("Query for highest interval failed.")
    }
}

export function getInterval(interval: number) {
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

    const movies = new MovieTable()

    try {
        return movies.exec<RangeEntry>(query, [interval])
    } catch(e) {
        console.error(e)
        throw new Error("Interval query failed.")
    }
}