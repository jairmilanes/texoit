import spinner from "./spinner.service";
import {createReadStream} from "fs";
import path from "path";
import {parse} from "csv-parse";
import {DbTable} from "./db-table.service";

export class SeedService<T> {
    file: string;
    model: DbTable<T>;
    throttle = 5

    constructor(filePath: string, model: DbTable<T>) {
        this.file = path.resolve(path.join("./seed", filePath));
        this.model = model;
    }

    drop(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.model.db.run(`DROP TABLE IF EXISTS movies`, (error) => {
                if (error) return reject(error)
                return resolve()
            })
        })
    }

    createTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            spinner.text = 'Creatging table...'

            this.model.db.serialize(() => {
                const definitions =
                    this.model.deffinition.join(",\r\n")

                const query = `
                    CREATE TABLE IF NOT EXISTS movies (
                        id INTEGER PRIMARY KEY,
                        ${definitions}
                    )`

                const onResponse = (error?: Error) => {
                    if (!error) {
                        spinner.text = 'Table created successfully'

                        return resolve()
                    }

                    spinner.text = error.message

                    return reject(error)
                }

                this.model.db.run(query, onResponse);
            })
        })
    }

    wait(mili: number) {
        return new Promise((resolve) => setTimeout(resolve, mili))
    }

    createParser() {
        return createReadStream(this.file)
            .pipe(parse({delimiter: ';'}))
    }

    async seed(onRow: (row: string[], all: string[][]) => Promise<void>): Promise<string[][]> {
        spinner.prefixText = 'Seeding data, please hold...'

        const data: string[][] = []

        return new Promise((resolve, reject) => {
            const parser = this.createParser()

            parser
                .on('readable', async () => {
                    let row;
                    let count = 0

                    while ((row = parser.read()) !== null) {
                        try {
                            if (!count) {
                                count++;
                                continue;
                            }

                            spinner.text = "Row " + count

                            if (typeof onRow === "function") {
                                await onRow(row, data)
                            } else {
                                await this.model.insert(row)
                                data.push(row)
                                await this.wait(this.throttle)
                            }
                        } catch(e) {
                            console.error(e)
                            throw e
                        }

                        count++
                    }
                })
                .on('end', () => resolve(data))
                .on("error", reject)
        })
    }
}