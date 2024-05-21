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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const movies_init_service_1 = require("../src/services/movies.init.service");
describe("Integration", () => {
    let count;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        count = yield (0, movies_init_service_1.moviewsInit)(process.env.SEED_FILENAME, true);
    }));
    test("Return min and max intervals", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/winners/range")
            .set('Accept', 'application/json');
        expect(res.body).toHaveProperty("min");
        expect(res.body).toHaveProperty("max");
        expect(res.body.min).toHaveLength(3);
        expect(res.body.min[0]).toHaveProperty("id", 2);
        expect(res.body.min[1]).toHaveProperty("id", 14);
        expect(res.body.min[2]).toHaveProperty("id", 16);
        expect(res.body.max).toHaveLength(1);
        expect(res.body.max[0]).toHaveProperty("id", 10);
    }));
    test("Return years with miltiple winners", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/winners/by-year?limit=3")
            .set('Accept', 'application/json');
        expect(res.body).toHaveLength(3);
    }));
    test("Return top 3 studios", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/studios/top-three")
            .set('Accept', 'application/json');
        expect(res.body).toHaveLength(3);
        res.body.forEach((movie) => {
            expect(Object.keys(movie)).toHaveLength(2);
            expect(movie).toHaveProperty("studios");
            expect(movie).toHaveProperty("winners");
        });
        expect(res.body[0].studios).toEqual("Paramount Pictures");
        expect(res.body[0].winners).toEqual(5);
        expect(res.body[1].studios).toEqual("Associated Film Distribution");
        expect(res.body[1].winners).toEqual(5);
        expect(res.body[2].studios).toEqual("Universal Studios");
        expect(res.body[2].winners).toEqual(4);
    }));
    test("Return movies by year", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/movie/by-year?year=1986&limit=3")
            .set('Accept', 'application/json');
        expect(res.body).toHaveLength(3);
        res.body.forEach((movie) => {
            expect(Object.keys(movie)).toHaveLength(3);
            expect(movie).toHaveProperty("title");
            expect(movie).toHaveProperty("id");
            expect(movie).toHaveProperty("year", 1986);
        });
    }));
    describe("Search", () => {
        test("Return movie objects", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get("/movies?limit=6")
                .set('Accept', 'application/json');
            expect(res.body.items).toHaveLength(6);
            res.body.items.forEach((movie) => {
                expect(movie).toHaveProperty("id");
                expect(movie).toHaveProperty("year");
                expect(movie).toHaveProperty("title");
                expect(movie).toHaveProperty("studios");
                expect(movie).toHaveProperty("producers");
                expect(movie).toHaveProperty("winner");
            });
        }));
        test("Search by year", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get("/movies?year=1990")
                .set('Accept', 'application/json');
            expect(res.body.items).toHaveLength(1);
            expect(res.body.items[0]).toHaveProperty("id", 6);
        }));
        test("Limit results count", () => __awaiter(void 0, void 0, void 0, function* () {
            const res1 = yield (0, supertest_1.default)(app_1.default)
                .get("/movies?limit=3")
                .set('Accept', 'application/json');
            expect(res1.body.items).toHaveLength(3);
            const res2 = yield (0, supertest_1.default)(app_1.default)
                .get("/movies?limit=6")
                .set('Accept', 'application/json');
            expect(res2.body.items).toHaveLength(6);
            const res3 = yield (0, supertest_1.default)(app_1.default)
                .get("/movies?limit=15")
                .set('Accept', 'application/json');
            expect(res3.body.items).toHaveLength(15);
        }));
        test("Order by", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get("/movies?orderBy=year_ASC&limit=10")
                .set('Accept', 'application/json');
            expect(res.body.items).toHaveLength(10);
            expect(res.body.items[0]).toHaveProperty("title", "Endless Love");
            expect(res.body.items[0]).toHaveProperty("year", 1965);
            const res2 = yield (0, supertest_1.default)(app_1.default)
                .get("/movies?orderBy=year_DESC&limit=10")
                .set('Accept', 'application/json');
            expect(res2.body.items).toHaveLength(10);
            expect(res2.body.items[0]).toHaveProperty("title", "The Formula");
            expect(res2.body.items[0]).toHaveProperty("year", 2005);
        }));
    });
});
