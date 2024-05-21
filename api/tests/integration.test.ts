import request from "supertest";
import app from "../src/app";
import {moviewsInit} from "../src/services/movies.init.service";
import {Movie, TopStudios} from "../src/types";

describe("Integration", () => {

    let count: number

    beforeAll(async () => {
        count = await moviewsInit(
            process.env.SEED_FILENAME as string,
            true
        )
    })

    test("Return min and max intervals", async () => {
        const res = await request(app)
            .get("/winners/range")
            .set('Accept', 'application/json')

        expect(res.body).toHaveProperty("min");
        expect(res.body).toHaveProperty("max");
        expect(res.body.min).toHaveLength(3)
        expect(res.body.min[0]).toHaveProperty("id", 2)
        expect(res.body.min[1]).toHaveProperty("id", 14)
        expect(res.body.min[2]).toHaveProperty("id", 16)
        expect(res.body.max).toHaveLength(1)
        expect(res.body.max[0]).toHaveProperty("id", 10)
    })

    test("Return years with miltiple winners", async () => {
        const res = await request(app)
            .get("/winners/by-year?limit=3")
            .set('Accept', 'application/json')

        expect(res.body).toHaveLength(3)
    })

    test("Return top 3 studios", async () => {
        const res = await request(app)
            .get("/studios/top-three")
            .set('Accept', 'application/json')

        expect(res.body).toHaveLength(3)

        res.body.forEach((movie: TopStudios) => {
            expect(Object.keys(movie)).toHaveLength(2)
            expect(movie).toHaveProperty("studios")
            expect(movie).toHaveProperty("winners")
        })

        expect(res.body[0].studios).toEqual("Paramount Pictures")
        expect(res.body[0].winners).toEqual(5)
        expect(res.body[1].studios).toEqual("Associated Film Distribution")
        expect(res.body[1].winners).toEqual(5)
        expect(res.body[2].studios).toEqual("Universal Studios")
        expect(res.body[2].winners).toEqual(4)
    })

    test("Return movies by year", async () => {
        const res = await request(app)
            .get("/movie/by-year?year=1986&limit=3")
            .set('Accept', 'application/json')

        expect(res.body).toHaveLength(3)

        res.body.forEach((movie: Partial<Movie>) => {
            expect(Object.keys(movie)).toHaveLength(3)
            expect(movie).toHaveProperty("title")
            expect(movie).toHaveProperty("id")
            expect(movie).toHaveProperty("year", 1986)
        })
    })

    describe("Search", () => {
        test("Return movie objects", async () => {
            const res = await request(app)
                .get("/movies?limit=6")
                .set('Accept', 'application/json')

            expect(res.body.items).toHaveLength(6)

            res.body.items.forEach((movie: Movie) => {
                expect(movie).toHaveProperty("id")
                expect(movie).toHaveProperty("year")
                expect(movie).toHaveProperty("title")
                expect(movie).toHaveProperty("studios")
                expect(movie).toHaveProperty("producers")
                expect(movie).toHaveProperty("winner")
            })
        })

        test("Search by year", async () => {
            const res = await request(app)
                .get("/movies?year=1990")
                .set('Accept', 'application/json')

            expect(res.body.items).toHaveLength(1)
            expect(res.body.items[0]).toHaveProperty("id", 6)
        })

        test("Limit results count", async () => {
            const res1 = await request(app)
                .get("/movies?limit=3")
                .set('Accept', 'application/json')

            expect(res1.body.items).toHaveLength(3)

            const res2 = await request(app)
                .get("/movies?limit=6")
                .set('Accept', 'application/json')

            expect(res2.body.items).toHaveLength(6)

            const res3 = await request(app)
                .get("/movies?limit=15")
                .set('Accept', 'application/json')

            expect(res3.body.items).toHaveLength(15)
        })

        test("Order by", async () => {
            const res = await request(app)
                .get("/movies?orderBy=year_ASC&limit=10")
                .set('Accept', 'application/json')

            expect(res.body.items).toHaveLength(10)
            expect(res.body.items[0]).toHaveProperty("title", "Endless Love")
            expect(res.body.items[0]).toHaveProperty("year", 1965)

            const res2 = await request(app)
                .get("/movies?orderBy=year_DESC&limit=10")
                .set('Accept', 'application/json')

            expect(res2.body.items).toHaveLength(10)
            expect(res2.body.items[0]).toHaveProperty("title", "The Formula")
            expect(res2.body.items[0]).toHaveProperty("year", 2005)
        })
    })


})