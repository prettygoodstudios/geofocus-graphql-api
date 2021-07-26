import { UserInputError } from "apollo-server";
import { validate } from "class-validator";


export const humanReadableList = (list: string[]): string => {
    if (list.length == 0){
        return "";
    }
    if (list.length == 1){
        return list[0];
    }
    return `${list.reduce((prev, curr, i) => `${prev}${(prev && i != list.length-1) ? ", " : ""}${i == list.length-1 ? " and " : ""}${curr}`, "")}`
}

export const validateFields = async (ormObject: Object) => {
    const errors = await validate(ormObject);
    if (errors.length > 0){
        const errorMessage = `The following inputs failed validation ${humanReadableList(errors.map(e => e.property))}.`;
        const errorMap: { [key: string]: string } = {};
        errors.forEach(({property, constraints}) => {
            errorMap[property] = Object.values(constraints!)[0];
        });
        throw new UserInputError(errorMessage, {
            fields: errorMap
        });
    }
}