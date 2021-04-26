

export const humanReadableList = (list: string[]): string => {
    if (list.length == 0){
        return "";
    }
    if (list.length == 1){
        return list[0];
    }
    return `${list.reduce((prev, curr, i) => `${prev}${(prev && i != list.length-1) ? ", " : ""}${i == list.length-1 ? " and " : ""}${curr}`, "")}`
}