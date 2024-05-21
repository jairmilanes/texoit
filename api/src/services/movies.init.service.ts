import {MovieTable} from "../models/movie";
import {SeedService} from "./seed.service";
import spinner from "./spinner.service";

export async function moviewsInit(seedFilename: string, drop = false): Promise<number> {
    const movies = new MovieTable()
    const seed = new SeedService(seedFilename, movies)

    if (drop) {
        await seed.drop()
        await seed.createTable()

        await seed.seed(async (row, data) => {
            const producerIdx = row.length - 2
            const producerColumn = row[producerIdx]
            const producers = producerColumn
                .split(",")
                .reduce((ac: string[], p: string) => ([
                    ...ac,
                    ...p.trim().split(" and ").map(s => s.trim())
                ]), [])

            for (let i = 0; i < producers.length; i++) {
                row[producerIdx] = producers[i]
                spinner.prefixText = row[producerIdx]
                await movies.insert(row)
                data.push(row)
                await seed.wait(5)
            }
        })
    }

    return movies.count()
}