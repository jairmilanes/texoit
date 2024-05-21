import express, { Express, Request, Response } from "express";
import { config as dotEnv } from "dotenv"
import cors from "cors"
import {getHighestInterval, getInterval, getLowestInterval} from "./services/range.service";
import {MovieTable} from "./models/movie";
import {RequestEnhanced} from "./types";
import {DEFAULT_LIMIT, DEFAULT_OFFSET} from "./constants";

dotEnv({
    path: `.env.${process.env.NODE_ENV}`,
});

const app: Express = express();

app.use(cors())

app.get("/", async (req: Request, res: Response) => {
    res.json({
        message: "Alive!"
    });
});

app.get("/movies", async (req: RequestEnhanced, res: Response) => {
    try {
        const { q, page: currentPage, year, winner, orderBy: order, limit, offset } = req.query
        const movies = new MovieTable()
        const orderBy = (order || "title_ASC")
            .split(",")
            .map(pr => pr.split("_"))

        const count = await movies.count()

        const _limit = parseInt(limit || "0") || DEFAULT_LIMIT
        const _offset = currentPage
            ? (currentPage * _limit) - _limit
            : parseInt(offset || "0") || DEFAULT_OFFSET
        const page = currentPage || (_offset / _limit) + 1
        const pages = Math.ceil(count / (_limit))
        const next = page < pages ? page + 1 : null;
        const prev = page > 1 ? page - 1 : null
        const values: Array<string | number | boolean | undefined> = []
        const where: string[][] = []

        if (year) {
            where.push(["year", "=", "?"])
            values.push(year)
        }

        if (winner) {
            where.push(["winner", "=", "?"])
            values.push(winner === "yes" ? winner : '')
        }

        if (q) {
            where.push(["title", "=", "?"])
            values.push(q)
        }

        values.push(_limit)
        values.push(_offset)

        const results = await movies.all({
            select: ["*"],
            where,
            orderBy,
            limit: "?",
            offset: "?"
        }, values)

        res.json({
            items: results,
            page,
            pages,
            next,
            prev,
            count,
            limit: _limit,
            offset: _offset
        })

    } catch(e) {
        res.status(500).json({
            message: (e as Error).message
        })
    }
});

app.get("/winners/by-year", async (req: RequestEnhanced, res: Response) => {
    try {
        const { limit, offset } = req.query
        const movies = new MovieTable()
        const values: Array<string | number | boolean> = []

        values.push("yes")
        values.push(limit || 10)
        values.push(offset || 0)

        const results = await movies.all({
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
        }, values)

        res.json(results)
    } catch(e) {
        res.status(500).json({
            message: (e as Error).message
        })
    }
});

app.get("/studios/top-three", async (req: RequestEnhanced, res: Response) => {
    try {
        const movies = new MovieTable()
        const values: Array<string | number | boolean> = []

        values.push("yes")
        values.push(3)
        values.push(0)

        const results = await movies.all({
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
        }, values)

        res.json(results)
    } catch(e) {
        res.status(500).json({
            message: (e as Error).message
        })
    }
});

app.get("/movie/by-year", async (req: RequestEnhanced, res: Response) => {
    try {
        const { year, limit } = req.query
        const movies = new MovieTable()
        const values: Array<string | number | boolean | undefined> = []

        values.push("yes")
        values.push(year)
        values.push(limit || 10)
        values.push(0)

        const results = await movies.all({
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
        }, values)

        res.json(results)
    } catch(e) {
        res.status(500).json({
            message: (e as Error).message
        })
    }
});

app.get("/winners/range", async (req: RequestEnhanced, res: Response) => {
    try {
        const min = await getLowestInterval()
        const max = await getHighestInterval()

        const results = {
            min: await getInterval(min),
            max: await getInterval(max)
        }

        res.json(results)
    } catch(e) {
        res.status(500).json({
            message: (e as Error).message
        })
    }
});

export default app