import type { Request } from "express"

export interface Movie {
    year: string;
    title: string;
    studios: string;
    producers: string;
    winner: string;
}

export interface RangeEntry {
    id: number;
    producers: string;
    prevviousWin: number;
    followingWin: number;
    interval: number;
}

export interface QueryParams {
    select?: string[],
    where?: string[][];
    orderBy?: string[][];
    groupBy?: string[][];
    limit?: number | string,
    offset?: number | string;
}

export interface RequestParams {
}

export interface RequestBody {
}

export interface ResponseBody {
}

export interface RequestQuery {
    q?: string;
    page?: number;
    year?: string;
    winner?: "yes" | "no";
    limit?: string;
    offset?: string;
    orderBy?: string;
}

export interface TopStudios {
    studios: string;
    winners: number;
}

export type RequestEnhanced = Request<RequestParams, ResponseBody, RequestBody, RequestQuery>