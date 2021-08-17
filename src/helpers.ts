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
        const thumbnailProps = new Set<string>();
        const imageProps = new Set<string>();
        ['offsetX', 'offsetY', 'zoom'].forEach(p => thumbnailProps.add(p));
        ['width', 'height', 'profile_img', 'img_url'].forEach(p => imageProps.add(p));

        const needsImage = errors.filter(({property}) => imageProps.has(property)).length > 0 ;
        const needsThumbnail = errors.filter(({property}) => thumbnailProps.has(property)).length > 0;

        const errorProps = errors.filter(({property}) => !thumbnailProps.has(property) && !imageProps.has(property)).map(e => e.property);
        if (needsImage) {
            errorProps.push('image');
        } else if (needsThumbnail) {
            errorProps.push('thumbnail');
        }
        const errorMessage = `The following inputs failed validation ${humanReadableList(errorProps)}.`;
        const errorMap: { [key: string]: string } = {};
        errors.forEach(({property, constraints}) => {
            errorMap[property] = Object.values(constraints!)[0];
        });
        if (needsImage) {
            errorMap['image'] = 'You must select an image.';
        }else if (needsThumbnail) {
            errorMap['thumbnail'] = 'You must select an area for the thumbnail.';
        }
        throw new UserInputError(errorMessage, {
            fields: errorMap
        });
    }
}