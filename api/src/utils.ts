

export function findLowest(arr: Record<string, any>[], prop: string) {
    return arr.reduce((lowest, row) => {
        if (lowest === -1 || row[prop] < lowest) {
            return row[prop]
        }
        return lowest
    }, -1)
}

export function findHighest(arr: Record<string, any>[], prop: string) {
    return arr.reduce((highest, row) => {
        if (highest === -1 || row.interval > highest) {
            return row.interval
        }
        return highest
    }, -1)
}