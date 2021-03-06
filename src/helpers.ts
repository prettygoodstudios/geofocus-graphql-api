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
        const thumbnailProps = new Set<string>(['offsetX', 'offsetY', 'zoom']);
        const imageProps = new Set<string>(['width', 'height', 'profile_img', 'img_url']);

        const needsImage = errors.filter(({property}) => imageProps.has(property)).length > 0 ;
        const needsThumbnail = errors.filter(({property}) => thumbnailProps.has(property)).length > 0;

        const errorProps = errors.filter(({property}) => !thumbnailProps.has(property) && !imageProps.has(property)).map(e => e.property);
        
        const errorMap: { [key: string]: string } = {};
        errors.forEach(({property, constraints}) => {
            errorMap[property] = Object.values(constraints!)[0];
        });

        if (needsImage) {
            errorProps.push('image');
            errorMap['image'] = 'You must select an image.';
        }else if (needsThumbnail) {
            errorProps.push('thumbnail');
            errorMap['thumbnail'] = 'You must select an area for the thumbnail.';
        }
        const errorMessage = `The following inputs failed validation ${humanReadableList(errorProps)}.`;
        throw new UserInputError(errorMessage, {
            fields: errorMap
        });
    }
}