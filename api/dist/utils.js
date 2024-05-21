"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findHighest = exports.findLowest = void 0;
function findLowest(arr, prop) {
    return arr.reduce((lowest, row) => {
        if (lowest === -1 || row[prop] < lowest) {
            return row[prop];
        }
        return lowest;
    }, -1);
}
exports.findLowest = findLowest;
function findHighest(arr, prop) {
    return arr.reduce((highest, row) => {
        if (highest === -1 || row.interval > highest) {
            return row.interval;
        }
        return highest;
    }, -1);
}
exports.findHighest = findHighest;
